import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {User, UserInfo} from "./entity/user";

describe("github issues > #966 Inheritance in embeddables", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should save and load Superclass fields in embeddable", () => Promise.all(connections.map(async connection => {
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

        expect(info).toEqual(loadedUser!.info);
    })));

});
