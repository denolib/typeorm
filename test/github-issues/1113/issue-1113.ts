import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #1113 CreateDateColumn's type is incorrect when using decorator @CreateDateColumn({type: 'timestamp'})", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Post],
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
