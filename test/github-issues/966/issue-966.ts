import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User, UserInfo} from "./entity/user.ts";

describe("github issues > #966 Inheritance in embeddables", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
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
