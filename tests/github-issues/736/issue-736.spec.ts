import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";

describe("github issues > #736 ClosureEntity should set (composite) primary/unique key in the closure table", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should create composite primary key on closure ancestor and descendant", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("category_closure");
        expect(table!.findColumnByName("id_ancestor")!.isPrimary).toBeTruthy();
        expect(table!.findColumnByName("id_descendant")!.isPrimary).toBeTruthy();
        await queryRunner.release();
    })));

});
