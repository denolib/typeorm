import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/index.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {User} from "./entity/User.ts";

describe("github issues > #2006 Columns are being set to null after saving the entity", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should be able to find by boolean find", () => Promise.all(connections.map(async connection => {
        const user = new User();
        user.token = "sometoken";
        await connection.manager.save(user);
        user.token.should.be.equal("sometoken");
    })));

});

runIfMain(import.meta);
