import {SapDriver} from "../../../../src/driver/sap/SapDriver.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {PersonSchema} from "./entity/Person.ts";
import {MysqlDriver} from "../../../../src/driver/mysql/MysqlDriver.ts";
import {AbstractSqliteDriver} from "../../../../src/driver/sqlite-abstract/AbstractSqliteDriver.ts";

describe("entity-schema > uniques", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [PersonSchema as any],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should create an unique constraint with 2 columns", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        if (connection.driver instanceof MysqlDriver || connection.driver instanceof SapDriver) {
            expect(table!.indices.length).to.be.equal(1);
            expect(table!.indices[0].name).to.be.equal("UNIQUE_TEST");
            expect(table!.indices[0].isUnique).to.be.true;
            expect(table!.indices[0].columnNames.length).to.be.equal(2);
            expect(table!.indices[0].columnNames).to.deep.include.members(["FirstName", "LastName"]);

        } else if (connection.driver instanceof AbstractSqliteDriver) {
            expect(table!.uniques.length).to.be.equal(1);
            expect(table!.uniques[0].columnNames.length).to.be.equal(2);
            expect(table!.uniques[0].columnNames).to.deep.include.members(["FirstName", "LastName"]);

        } else {
            expect(table!.uniques.length).to.be.equal(1);
            expect(table!.uniques[0].name).to.be.equal("UNIQUE_TEST");
            expect(table!.uniques[0].columnNames.length).to.be.equal(2);
            expect(table!.uniques[0].columnNames).to.deep.include.members(["FirstName", "LastName"]);
        }

    })));

});

runIfMain(import.meta);
