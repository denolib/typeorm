import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {Post} from "./entity/Post";

describe("github issues > #438 how can i define unsigned column?", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql"],
            schemaCreate: true,
            dropSchema: true
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create and change column with UNSIGNED and ZEROFILL attributes", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        const metadata = connection.getMetadata(Post);
        const idColumnMetadata = metadata.findColumnWithPropertyName("id");
        const numColumnMetadata = metadata.findColumnWithPropertyName("num");
        let table = await queryRunner.getTable("post");

        expect(table!.findColumnByName("id")!.unsigned)!.toBeTruthy();
        expect(table!.findColumnByName("num")!.zerofill)!.toBeTruthy();
        expect(table!.findColumnByName("num")!.unsigned)!.toBeTruthy();

        idColumnMetadata!.unsigned = false;
        numColumnMetadata!.zerofill = false;
        numColumnMetadata!.unsigned = false;

        await connection.synchronize();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id")!.unsigned)!.toBeFalsy();
        expect(table!.findColumnByName("num")!.zerofill)!.toBeFalsy();
        expect(table!.findColumnByName("num")!.unsigned)!.toBeFalsy();

        await queryRunner.release();
    })));

});
