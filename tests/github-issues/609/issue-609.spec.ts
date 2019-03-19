import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";

describe("github issues > #609 Custom precision on CreateDateColumn and UpdateDateColumn", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql"],
            schemaCreate: true,
            dropSchema: true
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should create `CreateDateColumn` and `UpdateDateColumn` column with custom default", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("createDate")!.default).toEqual("CURRENT_TIMESTAMP");
    })));

});
