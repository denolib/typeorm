import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";

describe("github issues > #1113 CreateDateColumn's type is incorrect when using decorator @CreateDateColumn({type: 'timestamp'})", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create date column from @CreateDateColumn decorator and with custom column type", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("createdAt")!.type).toEqual("timestamp");
        expect(table!.findColumnByName("updatedAt")!.type).toEqual("timestamp");
        await queryRunner.release();

    })));

});
