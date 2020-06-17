import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/index.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {User} from "./entity/User.ts";
import {Photo} from "./entity/Photo.ts";

// TODO(uki00a) This suite is skipped because it depends on `string_decoder` module.
describe.skip("github issues > #2044 Should not double get embedded column value", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Photo, User],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("Insert query should work with relational columns", () => Promise.all(connections.map(async connection => {
        let userId = "1234";
        let photoId = "4321";

        const user = new User();
        user.id = userId;
        user.age = 25;
        await connection.manager.save(user);

        const photo = new Photo();
        photo.id = photoId;
        photo.description = "Tall trees";
        photo.user = user;
        await connection.manager.save(photo);

        const photos = await connection.manager.find(Photo, {
            relations: ["user"]
        });
        // console.log(photos);

        const resultPhoto = photos[0];

        resultPhoto.id.should.be.eql(photoId);
        resultPhoto.user.id.should.be.eql(userId);
    })));

});

runIfMain(import.meta);
