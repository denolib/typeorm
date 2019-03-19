import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {Account} from "./entity/Account";
import {PromiseUtils} from "../../../src";

describe("github issues > #1805 bigint PK incorrectly returning as a number (expecting a string)", () => {

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

    test("should return `bigint` column as string", () => PromiseUtils.runInSequence(connections, async connection => {
        Account.useConnection(connection);
        let account: Account|undefined;
        const bigIntId = "76561198016705746";
        account = new Account();
        account.id = bigIntId;
        await account.save();

        account = await Account.findOne(bigIntId);
        expect(account!.id).toEqual(bigIntId);
    }));

});
