import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { MyEntity } from "./entity/Entity.ts";

describe("github issues > #3828 Conflicting PR to fix postgres schema:log with uppercase table names and enums", () => {

    let connections: Connection[];

    before(async () => {
        connections = await createTestingConnections({
            entities: [MyEntity],
            enabledDrivers: ["postgres"],
            schemaCreate: true,
            dropSchema: true,
        });
    });

    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("schema sync should work when enum type name was changed", () => Promise.all(connections.map(async connection => {
        // Rename type to what typeorm 0.2.14 created
        // @see https://github.com/typeorm/typeorm/commit/0338d5eedcaedfd9571a90ebe1975b9b07c8e07a
        await connection.query(`ALTER TYPE "MyEntity_mycolumn_enum" RENAME TO "myentity_mycolumn_enum"`);

        // Sync database, so that typeorm create the table and enum type
        await connection.synchronize();
    })));
});

runIfMain(import.meta);
