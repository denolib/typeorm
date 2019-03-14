import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";
import {ColumnMetadata} from "../../../src/metadata/ColumnMetadata";
import {ColumnMetadataArgs} from "../../../src/metadata-args/ColumnMetadataArgs";
import {Post} from "./entity/Post";

let connections: Connection[];
beforeAll(async () => {
    connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchema: true,
    });
});
afterAll(() => closeTestingConnections(connections));

test("should correctly add column", () => Promise.all(connections.map(async connection => {

    const postMetadata = connection.getMetadata("post");

    const columnMetadata1 = new ColumnMetadata({
        connection: connection,
        entityMetadata: postMetadata!,
        args: <ColumnMetadataArgs>{
            target: Post,
            propertyName: "secondId",
            mode: "regular",
            options: {
                type: "int",
                name: "secondId",
                primary: !(connection.driver instanceof CockroachDriver), // CockroachDB does not allow changing pk
                nullable: false
            }
        }
    });
    columnMetadata1.build(connection);

    const columnMetadata2 = new ColumnMetadata({
        connection: connection,
        entityMetadata: postMetadata!,
        args: <ColumnMetadataArgs>{
            target: Post,
            propertyName: "description",
            mode: "regular",
            options: {
                type: "varchar",
                name: "description",
                length: 100
            }
        }
    });
    columnMetadata2.build(connection);

    postMetadata.columns.push(...[columnMetadata1, columnMetadata2]);

    await connection.synchronize();

    const queryRunner = connection.createQueryRunner();
    const table = await queryRunner.getTable("post");
    const column1 = table!.findColumnByName("secondId")!;

    expect(column1).toBeDefined();
    expect(column1.isNullable).toBeFalsy();
    if (!(connection.driver instanceof CockroachDriver))
        expect(column1.isPrimary).toBeTruthy();

    const column2 = table!.findColumnByName("description")!;
    expect(column2).toBeDefined();
    expect(column2.length).toEqual("100");

    await queryRunner.release();
})));

