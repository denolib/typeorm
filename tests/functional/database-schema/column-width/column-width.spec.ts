import "reflect-metadata";
import {Connection} from "../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../utils/test-utils";
import {Post} from "./entity/Post";

describe("database schema > column width", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [Post],
            enabledDrivers: ["mysql"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    it("all types should be created with correct width", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("int")!.width).toEqual(10);
        expect(table!.findColumnByName("tinyint")!.width).toEqual(2);
        expect(table!.findColumnByName("smallint")!.width).toEqual(3);
        expect(table!.findColumnByName("mediumint")!.width).toEqual(9);
        expect(table!.findColumnByName("bigint")!.width).toEqual(10);

    })));

    it("should update data type display width", () => Promise.all(connections.map(async connection => {
        
        let metadata = connection.getMetadata(Post);
        metadata.findColumnWithPropertyName("int")!.width = 5;
        metadata.findColumnWithPropertyName("tinyint")!.width = 3;
        metadata.findColumnWithPropertyName("smallint")!.width = 4;
        metadata.findColumnWithPropertyName("mediumint")!.width = 10;
        metadata.findColumnWithPropertyName("bigint")!.width = 11;

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("int")!.width).toEqual(5);
        expect(table!.findColumnByName("tinyint")!.width).toEqual(3);
        expect(table!.findColumnByName("smallint")!.width).toEqual(4);
        expect(table!.findColumnByName("mediumint")!.width).toEqual(10);
        expect(table!.findColumnByName("bigint")!.width).toEqual(11);
        
    })));

});
