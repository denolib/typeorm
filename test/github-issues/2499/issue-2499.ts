import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Foo} from "./entity/Foo.ts";

describe("github issues > #2499 Postgres DELETE query result is useless", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Foo],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should return correct number of affected rows for mysql, mariadb, postgres", () => Promise.all(connections.map(async connection => {
        // skip test for sqlite because sqlite doesn't return any data on delete
        // sqljs -- the same
        // mongodb requires another test and it is also doesn't return correct number
        // of removed documents (possibly a bug with mongodb itself)
        if (["mysql", "mariadb", "mssql", "postgres"].indexOf(connection.name) === -1) {
            return;
        }
        const repo = connection.getRepository(Foo);

        await repo.save({ id: 1, description: "test1" });
        await repo.save({ id: 2, description: "test2" });
        await repo.save({ id: 3, description: "test3" });

        // number 4 doesn't exist
        const result = await repo.delete([1, 2, 3, 4]);

        expect(result.affected).to.eql(3);
    })));
});

runIfMain(import.meta);
