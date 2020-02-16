import {runIfMain} from "../../../deps/mocha.ts";
import "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {PersonSchema} from "./entity/Person.ts";
import {MysqlDriver} from "../../../../src/driver/mysql/MysqlDriver.ts";

describe("entity-schema > checks", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [PersonSchema as any],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should create a check constraints", () => Promise.all(connections.map(async connection => {
        // Mysql does not support check constraints.
        if (connection.driver instanceof MysqlDriver)
            return;

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        table!.checks.length.should.be.equal(2);

    })));

});

runIfMain(import.meta);
