import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {PersonSchema} from "./entity/Person";
import {MysqlDriver} from "../../../../src/driver/mysql/MysqlDriver";

describe("entity-schema > checks", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [<any>PersonSchema],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should create a check constraints", () => Promise.all(connections.map(async connection => {
        // Mysql does not support check constraints.
        if (connection.driver instanceof MysqlDriver)
            return;

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        expect(table!.checks.length).toEqual(2);

    })));

});
