import "reflect-metadata";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {SqlServerDriver} from "../../../../src/driver/sqlserver/SqlServerDriver";

describe("multi-schema-and-database > custom-junction-database", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [Post, Category],
            enabledDrivers: ["mysql"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create tables when custom table schema used", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        if (connection.driver instanceof SqlServerDriver) {
            const postTable = await queryRunner.getTable("yoman..post");
            const categoryTable = await queryRunner.getTable("yoman..category");
            const junctionMetadata = connection.getManyToManyMetadata(Post, "categories")!;
            const junctionTable = await queryRunner.getTable("yoman.." + junctionMetadata.tableName);
            expect(postTable).not.toBeUndefined();
            expect(postTable!.name)!.toEqual("yoman..post");
            expect(categoryTable).not.toBeUndefined();
            expect(categoryTable!.name)!.toEqual("yoman..category");
            expect(junctionTable).not.toBeUndefined();
            expect(junctionTable!.name)!.toEqual("yoman.." + junctionMetadata.tableName);

        } else { // mysql
            const postTable = await queryRunner.getTable("yoman.post");
            const categoryTable = await queryRunner.getTable("yoman.category");
            const junctionMetadata = connection.getManyToManyMetadata(Post, "categories")!;
            const junctionTable = await queryRunner.getTable("yoman." + junctionMetadata.tableName);
            expect(postTable).not.toBeUndefined();
            expect(postTable!.name)!.toEqual("yoman.post");
            expect(categoryTable).not.toBeUndefined();
            expect(categoryTable!.name)!.toEqual("yoman.category");
            expect(junctionTable).not.toBeUndefined();
            expect(junctionTable!.name)!.toEqual("yoman." + junctionMetadata.tableName);
        }
        await queryRunner.release();
    })));

});
