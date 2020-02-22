import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Account} from "./entity/Account.ts";
import {PromiseUtils} from "../../../src/index.ts";

describe("github issues > #1805 bigint PK incorrectly returning as a number (expecting a string)", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["mysql"],
            schemaCreate: true,
            dropSchema: true
        });
    });
    after(() => closeTestingConnections(connections));

    it("should return `bigint` column as string", () => PromiseUtils.runInSequence(connections, async connection => {
        Account.useConnection(connection);
        let account: Account|undefined;
        const bigIntId = "76561198016705746";
        account = new Account();
        account.id = bigIntId;
        await account.save();

        account = await Account.findOne(bigIntId);
        account!.id.should.be.equal(bigIntId);
    }));

});

runIfMain(import.meta);
