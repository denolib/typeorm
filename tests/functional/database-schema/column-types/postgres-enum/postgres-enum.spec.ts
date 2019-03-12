import "reflect-metadata";
import {Connection} from "../../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";
import {Post} from "./entity/Post";
import {Table, TableColumn} from "../../../../../src";

describe("database schema > column types > postgres-enum", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["postgres"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should create table with ENUM column and save data to it", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        const post = new Post();
        post.enum = "A";
        post.simpleEnum = "A";
        post.name = "Post #1";
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.enum).toEqual(post.enum);
        expect(loadedPost.simpleEnum).toEqual(post.simpleEnum);

        expect(table!.findColumnByName("enum")!.type).toEqual("enum");
        expect(table!.findColumnByName("simpleEnum")!.type).toEqual("enum");
    })));

    test("should create ENUM column and revert creation", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        await queryRunner.addColumn("post", new TableColumn({
            name: "newEnum",
            type: "enum",
            enum: ["Apple", "Pineapple"]
        }));

        let table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("newEnum")!.type).toEqual("enum");

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("newEnum")).toBeUndefined();

        await queryRunner.release();
    })));

    test("should drop ENUM column and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        const enumColumn = table!.findColumnByName("enum")!;

        await queryRunner.dropColumn(table!, enumColumn);
        expect(table!.findColumnByName("enum")).toBeUndefined();

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("enum")!.type).toEqual("enum");

        await queryRunner.release();
    })));

    test("should create table with ENUM column and revert creation", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        await queryRunner.createTable(new Table({
            name: "question",
            columns: [
                {
                    name: "enum",
                    type: "enum",
                    enum: ["Apple", "Banana", "Cherry"]
                }
            ]
        }));

        let table = await queryRunner.getTable("question");
        const enumColumn = table!.findColumnByName("enum")!;
        expect(enumColumn.type).toEqual("enum");
        expect(enumColumn.enum!).toEqual(["Apple", "Banana", "Cherry"]);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("question");
        expect(table).toBeUndefined();

        await queryRunner.release();
    })));

    test("should drop table with ENUM column and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        await queryRunner.dropTable("post");

        let table = await queryRunner.getTable("post");
        expect(table).toBeUndefined();

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table).toBeDefined();

        await queryRunner.release();
    })));

    test("should change non-enum column in to ENUM and revert change", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        let nameColumn = table!.findColumnByName("name")!;
        let changedColumn = nameColumn.clone();
        changedColumn.type = "enum";
        changedColumn.enum = ["Apple", "Banana", "Cherry"];

        await queryRunner.changeColumn(table!, nameColumn, changedColumn);

        table = await queryRunner.getTable("post");
        changedColumn = table!.findColumnByName("name")!;
        expect(changedColumn.type).toEqual("enum");
        expect(changedColumn.enum!).toEqual(["Apple", "Banana", "Cherry"]);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        nameColumn = table!.findColumnByName("name")!;
        expect(nameColumn.type).toEqual("character varying");
        expect(nameColumn.enum).toBeUndefined();

        await queryRunner.release();
    })));

    test("should change ENUM column in to non-enum and revert change", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        let enumColumn = table!.findColumnByName("enum")!;
        let changedColumn = enumColumn.clone();
        changedColumn.type = "character varying";
        changedColumn.enum = undefined;

        await queryRunner.changeColumn(table!, enumColumn, changedColumn);

        table = await queryRunner.getTable("post");
        changedColumn = table!.findColumnByName("enum")!;
        expect(changedColumn.type).toEqual("character varying");
        expect(changedColumn.enum).toBeUndefined();

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        enumColumn = table!.findColumnByName("enum")!;
        expect(enumColumn.type).toEqual("enum");
        expect(enumColumn.enum!).toEqual(["A", "B", "C"]);

        await queryRunner.release();
    })));

    test("should change ENUM column and revert change", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        const enumColumn = table!.findColumnByName("enum")!;
        const changedColumn = enumColumn.clone();
        changedColumn.enum = ["C", "D", "E"];

        await queryRunner.changeColumn(table!, enumColumn, changedColumn);

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("enum")!.enum!).toEqual(["C", "D", "E"]);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("enum")!.enum!).toEqual(["A", "B", "C"]);

        await queryRunner.release();
    })));

    test("should rename ENUM when column renamed and revert rename", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const currentSchemaQuery = await queryRunner.query(`SELECT * FROM current_schema()`);
        const currentSchema = currentSchemaQuery[0]["current_schema"];
        const table = await queryRunner.getTable("post");
        const enumColumn = table!.findColumnByName("enum")!;
        const changedColumn = enumColumn.clone();
        changedColumn.name = "enumerable";

        await queryRunner.changeColumn(table!, enumColumn, changedColumn);

        let result = await queryRunner.query(`SELECT "n"."nspname", "t"."typname" FROM "pg_type" "t" ` +
            `INNER JOIN "pg_namespace" "n" ON "n"."oid" = "t"."typnamespace" ` +
            `WHERE "n"."nspname" = '${currentSchema}' AND "t"."typname" = 'post_enumerable_enum'`);
        expect(result.length).toEqual(1);

        await queryRunner.executeMemoryDownSql();

        result = await queryRunner.query(`SELECT "n"."nspname", "t"."typname" FROM "pg_type" "t" ` +
            `INNER JOIN "pg_namespace" "n" ON "n"."oid" = "t"."typnamespace" ` +
            `WHERE "n"."nspname" = '${currentSchema}' AND "t"."typname" = 'post_enum_enum'`);
        expect(result.length).toEqual(1);

        await queryRunner.release();
    })));

    test("should rename ENUM when table renamed and revert rename", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const currentSchemaQuery = await queryRunner.query(`SELECT * FROM current_schema()`);
        const currentSchema = currentSchemaQuery[0]["current_schema"];
        const table = await queryRunner.getTable("post");

        await queryRunner.renameTable(table!, "question");

        let result = await queryRunner.query(`SELECT "n"."nspname", "t"."typname" FROM "pg_type" "t" ` +
            `INNER JOIN "pg_namespace" "n" ON "n"."oid" = "t"."typnamespace" ` +
            `WHERE "n"."nspname" = '${currentSchema}' AND "t"."typname" = 'question_enum_enum'`);
        expect(result.length).toEqual(1);

        await queryRunner.executeMemoryDownSql();

        result = await queryRunner.query(`SELECT "n"."nspname", "t"."typname" FROM "pg_type" "t" ` +
            `INNER JOIN "pg_namespace" "n" ON "n"."oid" = "t"."typnamespace" ` +
            `WHERE "n"."nspname" = '${currentSchema}' AND "t"."typname" = 'post_enum_enum'`);
        expect(result.length).toEqual(1);

        await queryRunner.release();
    })));

});
