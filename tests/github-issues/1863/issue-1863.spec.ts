import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {Table} from "../../../src";

describe("github issues > #1863 createTable.uniques doesn't work when the columnNames only has one item", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            enabledDrivers: ["mysql"],
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create table with unique constraint", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        await queryRunner.createTable(new Table({
            name: "post",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false
                }
            ],
            uniques: [
                {
                    name: "table_unique",
                    columnNames: ["name"]
                }
            ]
        }));

        const table = await queryRunner.getTable("post");
        expect(table!.indices.length).toEqual(1);
        expect(table!.indices[0].name)!.toEqual("table_unique");

    })));

});
