import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Account} from "./entity/Account.ts";
import {AccountActivationToken} from "./entity/AccountActivationToken.ts";
import {Token} from "./entity/Token.ts";

describe("save child and parent entity", () => {

    let connections: Connection[] = [];
    before(async () => connections = await createTestingConnections({
        entities: [Account, AccountActivationToken, Token],
        enabledDrivers: ["mysql", "mariadb", "sqlite", "sqljs"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));


    it("account property in accountActivationToken should not be null", () => Promise.all(connections.map(async connection => {

        const account = new Account();
        account.username = "test";
        account.password = "123456";
        account.accountActivationToken = new AccountActivationToken("XXXXXXXXXXXXXXXXXX", new Date());

        const savedAccount = await connection.manager.save(account);
        expect(savedAccount.accountActivationToken.account).not.to.be.null;

    })));

});

runIfMain(import.meta);
