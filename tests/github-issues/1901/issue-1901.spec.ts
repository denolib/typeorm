import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";
import {Post} from "./entity/Post";

describe("github issues > #1901 The correct way of adding `ON UPDATE CURRENT_TIMESTAMP` clause to timestamp column", () => {

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

    test("should correctly create and change column with ON UPDATE expression", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("updateAt")!.onUpdate)!.toEqual("CURRENT_TIMESTAMP(3)");

        const metadata = connection.getMetadata(Post);
        metadata.findColumnWithPropertyName("updateAt")!.onUpdate = undefined;
        await connection.synchronize();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("updateAt")!.onUpdate).toBeUndefined();

    })));

});
