import "reflect-metadata";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("multi-schema-and-database > custom-junction-schema", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [Post, Category],
            enabledDrivers: ["mssql", "postgres"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create tables when custom table schema used", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        const postTable = await queryRunner.getTable("yoman.post");
        const categoryTable = await queryRunner.getTable("yoman.category");
        const junctionMetadata = connection.getManyToManyMetadata(Post, "categories")!;
        const junctionTable = await queryRunner.getTable("yoman." + junctionMetadata.tableName);
        await queryRunner.release();
        expect(postTable).not.toBeUndefined();
        expect(postTable!.name)!.toEqual("yoman.post");
        expect(categoryTable).not.toBeUndefined();
        expect(categoryTable!.name)!.toEqual("yoman.category");
        expect(junctionTable).not.toBeUndefined();
        expect(junctionTable!.name)!.toEqual("yoman." + junctionMetadata.tableName);
    })));

});
