import "reflect-metadata";
import {Connection} from "../../../src";
import {PostgresConnectionOptions} from "../../../src/driver/postgres/PostgresConnectionOptions";

describe.skip("github issues > #114 Can not be parsed correctly the URL of pg.", () => {

    let connection: Connection;
    beforeAll(() => {
        connection = new Connection({
            type: "postgres",
            url: "postgres://test:test@localhost:5432/test",
        });
    });

    test("should not fail in url parser", () => {
        const options = connection.options as PostgresConnectionOptions;
        expect(options.username).toEqual("test");
        expect(options.password).toEqual("test");
        expect(options.host).toEqual("localhost");
        expect(options.port).toEqual(5432);
        expect(options.database).toEqual("test");
    });

});
