import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";

describe("github issues > #1615 Datetime2 with any precision result in datetime2(7) in database", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*{.js,.ts}")],
            enabledDrivers: ["mssql"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly create column with Datetime2 type and any precision", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("Foo");
        table!.findColumnByName("date")!.type.should.be.equal("datetime2");
        table!.findColumnByName("date")!.precision!.should.be.equal(0);
        await queryRunner.release();

    })));

});

runIfMain(import.meta);
