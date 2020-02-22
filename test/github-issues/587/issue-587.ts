import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";

describe("github issues > #587 Ordering of fields in composite indexes defined using Index decorator", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    // this test only works for fields specified as string[]
    it("should preserve field ordering when fields are specified as string[]", () => Promise.all(connections.map(async connection => {
        connection.entityMetadatas.forEach(entityMetadata => {
            entityMetadata.indices.forEach(index => {
                if (index.givenColumnNames && index.givenColumnNames instanceof Array) {
                    for (let i = 0; i < index.columns.length; i++) {
                        const givenColumn = (index.givenColumnNames as string[])[i];
                        const actualColumn = index.columns[i];
                        actualColumn.propertyName.should.equal(givenColumn);
                    }
                }
            });
        });
    })));

});

runIfMain(import.meta);
