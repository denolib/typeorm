import "reflect-metadata";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";
import {Post} from "./entity/Post";
import {Connection} from "../../../../../src";

describe("database schema > column length > mssql", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [Post],
            enabledDrivers: ["mssql"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("all types should create with correct size", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("char")!.length).toEqual("50");
        expect(table!.findColumnByName("varchar")!.length).toEqual("50");
        expect(table!.findColumnByName("nchar")!.length).toEqual("50");
        expect(table!.findColumnByName("nvarchar")!.length).toEqual("50");
        expect(table!.findColumnByName("binary")!.length).toEqual("50");
        expect(table!.findColumnByName("varbinary")!.length).toEqual("50");
    
    })));

    test("all types should update their size", () => Promise.all(connections.map(async connection => {
        
        let metadata = connection.getMetadata(Post);
        metadata.findColumnWithPropertyName("char")!.length = "100";
        metadata.findColumnWithPropertyName("varchar")!.length = "100";
        metadata.findColumnWithPropertyName("nchar")!.length = "100";
        metadata.findColumnWithPropertyName("nvarchar")!.length = "100";
        metadata.findColumnWithPropertyName("binary")!.length = "100";
        metadata.findColumnWithPropertyName("varbinary")!.length = "100";

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("char")!.length).toEqual("100");
        expect(table!.findColumnByName("varchar")!.length).toEqual("100");
        expect(table!.findColumnByName("nchar")!.length).toEqual("100");
        expect(table!.findColumnByName("nvarchar")!.length).toEqual("100");
        expect(table!.findColumnByName("binary")!.length).toEqual("100");
        expect(table!.findColumnByName("varbinary")!.length).toEqual("100");
            
    })));

    test("all relevant types should update their size to max", () => Promise.all(connections.map(async connection => {
        
        let metadata = connection.getMetadata(Post);
        metadata.findColumnWithPropertyName("varchar")!.length = "MAX";
        metadata.findColumnWithPropertyName("nvarchar")!.length = "MAX";
        metadata.findColumnWithPropertyName("varbinary")!.length = "MAX";

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("varchar")!.length).toEqual("MAX");
        expect(table!.findColumnByName("nvarchar")!.length).toEqual("MAX");
        expect(table!.findColumnByName("varbinary")!.length).toEqual("MAX");
            
    })));
    
});
