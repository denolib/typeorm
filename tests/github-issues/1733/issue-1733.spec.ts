import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {Post} from "./entity/Post";

describe("github issues > #1733 Postgresql driver does not detect/support varying without length specified", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["postgres"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly synchronize schema when varchar column length is not specified", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");

        expect(table!.findColumnByName("name")!.length).toBeDefined();
        expect(table!.findColumnByName("name2")!.length).toEqual("255");

        const postMetadata = connection.getMetadata(Post);
        const column1 = postMetadata.findColumnWithPropertyName("name")!;
        const column2 = postMetadata.findColumnWithPropertyName("name2")!;
        column1.length = "500";
        column2.length = "";

        await connection.synchronize();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("name")!.length).toEqual("500");
        expect(table!.findColumnByName("name2")!.length).toBeDefined();

        column1.length = "";
        column2.length = "255";

        await connection.synchronize();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("name")!.length).toBeDefined();
        expect(table!.findColumnByName("name2")!.length).toEqual("255");

        await queryRunner.release();
    })));

});
