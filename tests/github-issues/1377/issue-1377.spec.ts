import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";
import {Post} from "./entity/Post";

describe("github issues > #1377 Add support for `GENERATED ALWAYS AS` in MySQL", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create table with generated columns", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("virtualFullName")!.asExpression)!.toEqual("concat(`firstName`,' ',`lastName`)");
        expect(table!.findColumnByName("virtualFullName")!.generatedType)!.toEqual("VIRTUAL");
        expect(table!.findColumnByName("storedFullName")!.asExpression)!.toEqual("concat(`firstName`,' ',`lastName`)");
        expect(table!.findColumnByName("storedFullName")!.generatedType)!.toEqual("STORED");

        const metadata = connection.getMetadata(Post);
        const virtualFullNameColumn = metadata.findColumnWithPropertyName("virtualFullName");
        virtualFullNameColumn!.generatedType = "STORED";

        const storedFullNameColumn = metadata.findColumnWithPropertyName("storedFullName");
        storedFullNameColumn!.asExpression = "concat('Mr. ',`firstName`,' ',`lastName`)";
        await connection.synchronize();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("virtualFullName")!.generatedType)!.toEqual("STORED");
        expect(table!.findColumnByName("storedFullName")!.asExpression)!.toEqual("concat('Mr. ',`firstName`,' ',`lastName`)");

        await queryRunner.release();
    })));

});
