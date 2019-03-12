import "reflect-metadata";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";
import {Post} from "./entity/Post";
import {Connection} from "../../../../../src";

describe("database schema > column length > postgres", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [Post],
            enabledDrivers: ["postgres"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("all types should create with correct size", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("characterVarying")!.length).toEqual("50");
        expect(table!.findColumnByName("varchar")!.length).toEqual("50");
        expect(table!.findColumnByName("character")!.length).toEqual("50");
        expect(table!.findColumnByName("char")!.length).toEqual("50");
    
    })));

    test("all types should update their size", () => Promise.all(connections.map(async connection => {
        
        let metadata = connection.getMetadata(Post);
        metadata.findColumnWithPropertyName("characterVarying")!.length = "100";
        metadata.findColumnWithPropertyName("varchar")!.length = "100";
        metadata.findColumnWithPropertyName("character")!.length = "100";
        metadata.findColumnWithPropertyName("char")!.length = "100";

        await connection.synchronize(false);        

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("characterVarying")!.length).toEqual("100");
        expect(table!.findColumnByName("varchar")!.length).toEqual("100");
        expect(table!.findColumnByName("character")!.length).toEqual("100");
        expect(table!.findColumnByName("char")!.length).toEqual("100");
            
    })));
    
});
