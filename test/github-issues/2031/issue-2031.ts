import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection, Equal} from "../../../src/index.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {User} from "./entity/User.ts";
import {Photo} from "./entity/Photo.ts";

describe("github issues > #2031 Advanced find options with FKs", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Photo, User],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("find operators should work with relational columns as well", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.firstName = "Timber";
        user.lastName = "Saw";
        user.age = 25;
        await connection.manager.save(user);

        const photo = new Photo();
        photo.description = "Tall trees";
        photo.uri = "www.pictures.pic/1";
        photo.userId = user.id;
        await connection.manager.save(photo);

        const photos = await connection.manager.find(Photo, { where: { userId: Equal(user.id) } });
        photos.should.be.eql([{
            id: 1,
            description: "Tall trees",
            uri: "www.pictures.pic/1",
            userId: 1,
        }]);

    })));

});

runIfMain(import.meta);
