import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";

describe("github issues > #587 Ordering of fields in composite indexes defined using Index decorator", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    // this test only works for fields specified as string[]
    test("should preserve field ordering when fields are specified as string[]", () => Promise.all(connections.map(async connection => {
        connection.entityMetadatas.forEach(entityMetadata => {
            entityMetadata.indices.forEach(index => {
                if (index.givenColumnNames && index.givenColumnNames instanceof Array) {
                    for (let i = 0; i < index.columns.length; i++) {
                        const givenColumn = (index.givenColumnNames as string[])[i];
                        const actualColumn = index.columns[i];
                        expect(actualColumn.propertyName).toEqual(givenColumn);
                    }
                }
            });
        });
    })));

});
