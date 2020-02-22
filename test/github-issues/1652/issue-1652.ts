import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";

describe("github issues > #1652 Multiple primary key defined", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["mysql"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly create table when multiple primary keys defined and one of them is generated", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        table!.findColumnByName("id")!.isPrimary.should.be.true;
        table!.findColumnByName("id")!.isGenerated.should.be.true;
        table!.findColumnByName("id")!.generationStrategy!.should.be.equal("increment");
        table!.findColumnByName("name")!.isPrimary.should.be.true;
        await queryRunner.release();

    })));

});

runIfMain(import.meta);
