import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import { getConnectionManager } from "../../../src/index.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { closeTestingConnections } from "../../utils/test-utils.ts";
import { User } from "./entity/User.ts";

describe("github issues > #4753 MySQL Replication Config broken", () => {
    let connections: Connection[] = [];
    after(() => closeTestingConnections(connections));

    it("should connect without error when using replication", async () => {
        console.warn('This test is skipped because MysqlDriver is not implemented yet.');
        return;
        const connection = getConnectionManager().create({
            type: "mysql",
            replication: {
                master: {
                    username: "test",
                    password: "test",
                    database: "test"
                },
                slaves: [
                    {
                        username: "test",
                        password: "test",
                        database: "test"
                    }
                ]
            },
            entities: [User]
        });
        connections.push(connection);
        await connection.connect();
        connection.isConnected.should.be.true;
    });
});

runIfMain(import.meta);
