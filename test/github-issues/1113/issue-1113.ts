import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";

describe("github issues > #1113 CreateDateColumn's type is incorrect when using decorator @CreateDateColumn({type: 'timestamp'})", () => {

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

    it("should correctly create date column from @CreateDateColumn decorator and with custom column type", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        table!.findColumnByName("createdAt")!.type.should.be.equal("timestamp");
        table!.findColumnByName("updatedAt")!.type.should.be.equal("timestamp");
        await queryRunner.release();

    })));

});

runIfMain(import.meta);
