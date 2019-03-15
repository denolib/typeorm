import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {PersonSchema} from "./entity/Person";
import {MysqlDriver} from "../../../../src/driver/mysql/MysqlDriver";
import {AbstractSqliteDriver} from "../../../../src/driver/sqlite-abstract/AbstractSqliteDriver";

describe("entity-schema > uniques", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [<any>PersonSchema],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should create an unique constraint with 2 columns", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        if (connection.driver instanceof MysqlDriver) {
            expect(table!.indices.length).toEqual(1);
            expect(table!.indices[0].name).toEqual("UNIQUE_TEST");
            expect(table!.indices[0].isUnique).toBeTruthy();
            expect(table!.indices[0].columnNames.length).toEqual(2);
            expect(table!.indices[0].columnNames).toEqual(expect.arrayContaining(["FirstName", "LastName"]));

        } else if (connection.driver instanceof AbstractSqliteDriver) {
            expect(table!.uniques.length).toEqual(1);
            expect(table!.uniques[0].columnNames.length).toEqual(2);
            expect(table!.uniques[0].columnNames).toEqual(expect.arrayContaining(["FirstName", "LastName"]));

        } else {
            expect(table!.uniques.length).toEqual(1);
            expect(table!.uniques[0].name).toEqual("UNIQUE_TEST");
            expect(table!.uniques[0].columnNames.length).toEqual(2);
            expect(table!.uniques[0].columnNames).toEqual(expect.arrayContaining(["FirstName", "LastName"]));
        }

    })));

});
