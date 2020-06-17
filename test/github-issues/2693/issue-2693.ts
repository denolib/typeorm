import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Migration} from "../../../src/migration/Migration.ts";
import {QueryFailedError} from "../../../src/error/QueryFailedError.ts";
import {User} from "./entity/user.ts";

describe("github issues > #2875 Option to run migrations in 1-transaction-per-migration mode", () => {
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [User],
        schemaCreate: false,
        dropSchema: true,
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should fail to run all necessary migrations when transaction is all", () => Promise.all(connections.map(async connection => {
        let error;
        try {
            await connection.runMigrations({ transaction: "all" });
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(QueryFailedError);
        expect(error.message).to.equal("relation \"users\" does not exist");
    })));

    it("should be able to run all necessary migrations when transaction is each", () => Promise.all(connections.map(async connection => {
        const mymigr: Migration[] = await connection.runMigrations({ transaction: "each" });

        mymigr.length.should.be.equal(3);
        mymigr[0].name.should.be.equal("CreateUuidExtension0000000000001");
        mymigr[1].name.should.be.equal("CreateUsers0000000000002");
        mymigr[2].name.should.be.equal("InsertUser0000000000003");
    })));
 });

runIfMain(import.meta);
