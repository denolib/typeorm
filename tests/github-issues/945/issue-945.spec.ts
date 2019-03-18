import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";

describe("github issues > #945 synchronization with multiple primary keys", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("schema should include two primary keys", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("test_entity");

        if (table) {
            const firstId = table.columns.find(column => column.name === "id1");
            const secondId = table.columns.find(column => column.name === "id2");

            expect(table.columns.filter(column => column.isPrimary)).toHaveLength(2);
            expect(firstId).not.toBeUndefined();
            expect(secondId).not.toBeUndefined();
        }

        await queryRunner.release();
    })));

});
