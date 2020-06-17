import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User, UserInfo, PersonalInfo} from "./entity/user.ts";

describe("github issues > #966 Inheritance in embeddables", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [User, UserInfo, PersonalInfo],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should save and load Superclass fields in embeddable", () => Promise.all(connections.map(async connection => {
        const repository = connection.getRepository(User);

        const info = new UserInfo();
        info.firstName = "Ed";
        info.lastName = "Edd";
        info.userName = "Eddy";
        info.address = "github.com";

        const user = new User();
        user.info = info;

        await repository.save(user);

        const loadedUser = await repository.findOne(user.id);

        expect(info).to.deep.equal(loadedUser!.info);
    })));

});

runIfMain(import.meta);
