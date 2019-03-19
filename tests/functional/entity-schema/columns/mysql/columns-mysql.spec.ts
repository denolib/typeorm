import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src";
import {PersonSchema} from "./entity/Person";

describe("entity-schema > columns > mysql", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [<any>PersonSchema],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should create columns with different options", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        expect(table!.findColumnByName("Id")!.unsigned)!.toBeTruthy();
        expect(table!.findColumnByName("PostCode")!.zerofill)!.toBeTruthy();
        expect(table!.findColumnByName("PostCode")!.unsigned)!.toBeTruthy();
        expect(table!.findColumnByName("PostCode")!.width)!.toEqual(9);
        expect(table!.findColumnByName("VirtualFullName")!.asExpression)!.toEqual("concat(`FirstName`,' ',`LastName`)");
        expect(table!.findColumnByName("VirtualFullName")!.generatedType)!.toEqual("VIRTUAL");
        expect(table!.findColumnByName("StoredFullName")!.asExpression)!.toEqual("concat(`FirstName`,' ',`LastName`)");
        expect(table!.findColumnByName("StoredFullName")!.generatedType)!.toEqual("STORED");
        expect(table!.findColumnByName("LastVisitDate")!.onUpdate)!.toEqual("CURRENT_TIMESTAMP(3)");

    })));

});
