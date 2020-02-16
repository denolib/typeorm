import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
//import {PostgresConnectionOptions} from "../../../src/driver/postgres/PostgresConnectionOptions.ts";

describe.skip("github issues > #114 Can not be parsed correctly the URL of pg.", () => {

    let connection: Connection;
    before(() => {
        connection = new Connection({
            type: "postgres" as any, // TODO(uki00a) remove cast
            url: "postgres://test:test@localhost:5432/test",
        });
    });

    it("should not fail in url parser", () => {
        const options = connection.options as any/*PostgresConnectionOptions*/; // TODO(uki00a) uncomment this when PostgresDriver is implemented.
        expect(options.username).to.be.eq("test");
        expect(options.password).to.be.eq("test");
        expect(options.host).to.be.eq("localhost");
        expect(options.port).to.be.eq(5432);
        expect(options.database).to.be.eq("test");
    });

});

runIfMain(import.meta);
