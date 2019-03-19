import "reflect-metadata";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";

describe("github issues > #423 Cannot use Group as Table name && cannot autoSchemeSync when use alias Entity", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: false,
        dropSchema: true
    }));
    afterAll(() => closeTestingConnections(connections));

    test("should successfully sync schema", () => Promise.all(connections.map(async connection => {
        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("groups");
        await queryRunner.release();

        expect(table)!.toBeDefined();
        
        // CockroachDB stores unique indices as UNIQUE constraints
        if (connection.driver instanceof CockroachDriver) {
            expect(table!.uniques.length).toEqual(1);
            expect(table!.uniques[0].name)!.toEqual("Groups name");
            expect(table!.uniques[0].columnNames[0]).toEqual("name");
        } else {
            expect(table!.indices.length).toEqual(1);
            expect(table!.indices[0].name)!.toEqual("Groups name");
            expect(table!.indices[0].columnNames[0]).toEqual("name");
            expect(table!.indices[0].isUnique)!.toBeTruthy();
        }

    })));

});
