import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Account} from "./entity/Account";
import {AccountActivationToken} from "./entity/AccountActivationToken";

describe("save child and parent entity", () => {

    let connections: Connection[] = [];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql", "mariadb", "sqlite", "sqljs"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));


    test("account property in accountActivationToken should not be null", () => Promise.all(connections.map(async connection => {

        const account = new Account();
        account.username = "test";
        account.password = "123456";
        account.accountActivationToken = new AccountActivationToken("XXXXXXXXXXXXXXXXXX", new Date());

        const savedAccount = await connection.manager.save(account);
        expect(savedAccount.accountActivationToken.account).not.toBeNull();

    })));

});
