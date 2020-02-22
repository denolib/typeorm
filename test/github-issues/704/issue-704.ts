import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";

describe("github issues > #704 Table alias in WHERE clause is not quoted in PostgreSQL", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should return user by a given email and proper escape 'user' keyword", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.email = "john@example.com";
        await connection.manager.save(user);

        const loadedUser = await connection.getRepository(User).findOne({ email: "john@example.com" });

        loadedUser!.id.should.be.equal(1);
        loadedUser!.email.should.be.equal("john@example.com");
    })));

});

runIfMain(import.meta);
