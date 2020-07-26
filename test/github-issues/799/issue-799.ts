import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {dirname} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {emptyDir} from "../../../src/util/fs.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule} from "../../utils/test-utils.ts";
import {createConnection} from "../../../src/index.ts";
import {Connection} from "../../../src/connection/Connection.ts";

describe("github issues > #799 sqlite: 'database' path should be created", () => {
    let connection: Connection;

    const __dirname = getDirnameOfCurrentModule(import.meta);
    const path = joinPaths(__dirname, '/tmp/sqlitedb.db');
    const cleanup = () => emptyDir(dirname(path));

    before(cleanup);
    after(cleanup);

    afterEach(() => {
        if (connection && connection.isConnected) {
            connection.close();
        }
    });

    it("should create the whole path to database file", async function () {
        connection = await createConnection({
            "name": "sqlite",
            "type": "sqlite",
            "database": path
        });

        expect(connection.isConnected).to.be.true;
    });

});

runIfMain(import.meta);
