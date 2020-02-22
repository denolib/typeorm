import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createConnection, getConnectionOptions} from "../../../src/index.ts";
import {Connection} from "../../../src/connection/Connection.ts";

// TODO(uki00a) This suite fails because it loads the `app-root-path` npm module.
describe.skip("github issues > #798 sqlite: 'database' path in ormconfig.json is not relative", () => {
    let connection: Connection;
    const oldCwd = Deno.cwd();

    before(function () {
        Deno.chdir("..");
    });

    after(function () {
        Deno.chdir(oldCwd);
    });

    afterEach(() => {
        if (connection && connection.isConnected) {
            connection.close();
        }
    });

    it("should find the sqlite database if the cwd is changed", async function () {
        const options = await getConnectionOptions("sqlite");
        connection = await createConnection(options);

        expect(connection.isConnected).to.be.true;
    });

});

runIfMain(import.meta);
