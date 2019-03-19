import "reflect-metadata";
import * as assert from "assert";
import {createConnection} from "../../../src";
import * as rimraf from "rimraf";
import {dirname} from "path";
import {Connection} from "../../../src";

describe("github issues > #799 sqlite: 'database' path should be created", () => {
    let connection: Connection;

    const path = `${__dirname}/tmp/sqlitedb.db`;
    const cleanup = (done: () => void) => {
        rimraf(dirname(path), () => {
            return done();
        });
    };

    beforeAll(cleanup);
    afterAll(cleanup);

    afterEach(() => {
        if (connection && connection.isConnected) {
            connection.close();
        }
    });

    test("should create the whole path to database file", async function () {
        connection = await createConnection({
            "name": "sqlite",
            "type": "sqlite",
            "database": path
        });

        assert.strictEqual(connection.isConnected, true);
    });

});
