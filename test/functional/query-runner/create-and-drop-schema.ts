import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/index.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";

describe("query runner > create and drop schema", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["mssql", "postgres", "sap"],
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly create and drop schema and revert it", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        await queryRunner.createSchema("myTestSchema", true);
        let hasSchema = await queryRunner.hasSchema("myTestSchema");
        hasSchema.should.be.true;

        await queryRunner.dropSchema("myTestSchema");
        hasSchema = await queryRunner.hasSchema("myTestSchema");
        hasSchema.should.be.false;

        await queryRunner.executeMemoryDownSql();

        hasSchema = await queryRunner.hasSchema("myTestSchema");
        hasSchema.should.be.false;

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
