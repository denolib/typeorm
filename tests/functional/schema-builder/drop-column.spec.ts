import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";

describe("schema builder > drop column", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly drop column", () => Promise.all(connections.map(async connection => {

        // TODO: https://github.com/cockroachdb/cockroach/issues/34710
        if (connection.driver instanceof CockroachDriver)
            return;

        const studentMetadata = connection.getMetadata("student");
        const removedColumns = studentMetadata.columns.filter(column => ["name", "faculty"].indexOf(column.propertyName) !== -1);
        removedColumns.forEach(column => {
            studentMetadata.columns.splice(studentMetadata.columns.indexOf(column), 1);
        });
        studentMetadata.indices = [];
        const removedForeignKey = studentMetadata.foreignKeys.find(fk => {
            return !!fk.columns.find(column => column.propertyName === "faculty");
        });
        studentMetadata.foreignKeys.splice(studentMetadata.foreignKeys.indexOf(removedForeignKey!), 1);

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const studentTable = await queryRunner.getTable("student");
        await queryRunner.release();

        expect(studentTable!.findColumnByName("name")).toBeUndefined();
        expect(studentTable!.findColumnByName("faculty")).toBeUndefined();
        expect(studentTable!.indices.length).toEqual(0);
        expect(studentTable!.foreignKeys.length).toEqual(1);

    })));
});
