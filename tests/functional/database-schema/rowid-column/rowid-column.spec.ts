import "reflect-metadata";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../utils/test-utils";

describe("database-schema > rowid-column", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["cockroachdb"],
        dropSchema: true,
        schemaCreate: true,
    }));
    afterAll(() => closeTestingConnections(connections));

    test("should create `rowid` generated column", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        expect(table!.findColumnByName("id")!.type).toEqual("int");
        expect(table!.findColumnByName("id")!.isGenerated).toEqual(true);
        expect(table!.findColumnByName("id")!.generationStrategy!).toEqual("rowid");

        expect(table!.findColumnByName("id2")!.type).toEqual("int");
        expect(table!.findColumnByName("id2")!.isGenerated).toEqual(true);
        expect(table!.findColumnByName("id2")!.generationStrategy!).toEqual("rowid");

        expect(table!.findColumnByName("id3")!.type).toEqual("int");
        expect(table!.findColumnByName("id3")!.isGenerated).toEqual(true);
        expect(table!.findColumnByName("id3")!.generationStrategy!).toEqual("rowid");

        expect(table!.findColumnByName("id4")!.type).toEqual("int");
        expect(table!.findColumnByName("id4")!.isGenerated).toEqual(true);
        expect(table!.findColumnByName("id4")!.generationStrategy!).toEqual("rowid");

    })));

});
