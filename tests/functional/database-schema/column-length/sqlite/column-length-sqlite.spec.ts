import "reflect-metadata";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../utils/test-utils";
import {Post} from "./entity/Post";
import {Connection} from "../../../../../src";

describe("database schema > column length > sqlite", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [Post],
            enabledDrivers: ["sqlite"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("all types should create with correct size", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("character")!.length).toEqual("50");
        expect(table!.findColumnByName("varchar")!.length).toEqual("50");
        expect(table!.findColumnByName("nchar")!.length).toEqual("50");
        expect(table!.findColumnByName("nvarchar")!.length).toEqual("50");
        expect(table!.findColumnByName("varying_character")!.length).toEqual("50");
        expect(table!.findColumnByName("native_character")!.length).toEqual("50");

    })));

    test("all types should update their size", () => Promise.all(connections.map(async connection => {
        
        let metadata = connection.getMetadata(Post);
        metadata.findColumnWithPropertyName("character")!.length = "100";
        metadata.findColumnWithPropertyName("varchar")!.length = "100";
        metadata.findColumnWithPropertyName("nchar")!.length = "100";
        metadata.findColumnWithPropertyName("nvarchar")!.length = "100";
        metadata.findColumnWithPropertyName("varying_character")!.length = "100";
        metadata.findColumnWithPropertyName("native_character")!.length = "100";

        await connection.synchronize(false);

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("character")!.length).toEqual("100");
        expect(table!.findColumnByName("varchar")!.length).toEqual("100");
        expect(table!.findColumnByName("nchar")!.length).toEqual("100");
        expect(table!.findColumnByName("nvarchar")!.length).toEqual("100");
        expect(table!.findColumnByName("varying_character")!.length).toEqual("100");
        expect(table!.findColumnByName("native_character")!.length).toEqual("100");

        await connection.synchronize(false);

    })));
    
});
