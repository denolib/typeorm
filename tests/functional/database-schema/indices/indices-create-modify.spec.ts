import "reflect-metadata";
import {CockroachDriver} from "../../../../src/driver/cockroachdb/CockroachDriver";
import {Connection} from "../../../../src";
import {EntityMetadata} from "../../../../src";
import {IndexMetadata} from "../../../../src/metadata/IndexMetadata";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../test/utils/test-utils";

import {Person} from "./entity/Person";

describe("database schema > indices > reading index from entity and updating database", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should create a non unique index with 2 columns", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        expect(table!.indices.length).toEqual(1);
        expect(table!.indices[0].name).toEqual("IDX_TEST");
        expect(table!.indices[0].isUnique).toBeFalsy();
        expect(table!.indices[0].columnNames.length).toEqual(2);
        expect(table!.indices[0].columnNames).toContain("firstname");
        expect(table!.indices[0].columnNames).toContain("lastname");

    })));

    test("should update the index to be unique", () => Promise.all(connections.map(async connection => {

        const entityMetadata = connection.entityMetadatas.find(x => x.name === "Person");
        const indexMetadata = entityMetadata!.indices.find(x => x.name === "IDX_TEST");
        indexMetadata!.isUnique = true;

        await connection.synchronize(false);

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        // CockroachDB stores unique indices as UNIQUE constraints
        if (connection.driver instanceof CockroachDriver) {
            expect(table!.uniques.length).toEqual(1);
            expect(table!.uniques[0].name).toEqual("IDX_TEST");
            expect(table!.uniques[0].columnNames.length).toEqual(2);
            expect(table!.indices[0].columnNames).toContain("firstname");
            expect(table!.indices[0].columnNames).toContain("lastname");
        } else {
            expect(table!.indices.length).toEqual(1);
            expect(table!.indices[0].name).toEqual("IDX_TEST");
            expect(table!.indices[0].isUnique).toBeTruthy();
            expect(table!.indices[0].columnNames.length).toEqual(2);
            expect(table!.indices[0].columnNames).toContain("firstname");
            expect(table!.indices[0].columnNames).toContain("lastname");
        }

    })));

    test("should update the index swaping the 2 columns", () => Promise.all(connections.map(async connection => {

        const entityMetadata = connection.entityMetadatas.find(x => x.name === "Person");
        entityMetadata!.indices = [new IndexMetadata({
            entityMetadata: <EntityMetadata>entityMetadata,
            args: {
                target: Person,
                name: "IDX_TEST",
                columns: ["lastname", "firstname"],
                unique: false,
                synchronize: true
            }
        })];
        entityMetadata!.indices.forEach(index => index.build(connection.namingStrategy));

        await connection.synchronize(false);

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        expect(table!.indices.length).toEqual(1);
        expect(table!.indices[0].name).toEqual("IDX_TEST");
        expect(table!.indices[0].isUnique).toBeFalsy();
        expect(table!.indices[0].columnNames.length).toEqual(2);
        expect(table!.indices[0].columnNames).toContain("firstname");
        expect(table!.indices[0].columnNames).toContain("lastname");

    })));
});
