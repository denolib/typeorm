import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";

describe("github issues > #945 synchronization with multiple primary keys", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("schema should include two primary keys", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("test_entity");

        if (table) {
            const firstId = table.columns.find(column => column.name === "id1");
            const secondId = table.columns.find(column => column.name === "id2");

            expect(table.columns.filter(column => column.isPrimary)).length(2);
            expect(firstId).not.to.be.undefined;
            expect(secondId).not.to.be.undefined;
        }

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
