import { DriverUtils } from "../../../src/driver/DriverUtils";

describe("github issues > #1493 Error parsing pg connection string", () => {
    test("should parse url with empty password", () => {
        const obj: any = {
            username: "usern@me",
            password: "",
            host: "host",
            database: "database",
            port: 8888
        };
        const url = `postgres://${obj.username}:@${obj.host}:${obj.port}/${obj.database}`;
        const options = DriverUtils.buildDriverOptions({url});

        expect(options.username).toEqual(obj.username);
        expect(options.password).toEqual(obj.password);
    });

    test("should parse url without password", () => {
        const obj: any = {
            username: "usern@me",
            password: "",
            host: "host",
            database: "database",
            port: 8888
        };
        const url = `postgres://${obj.username}@${obj.host}:${obj.port}/${obj.database}`;
        const options = DriverUtils.buildDriverOptions({url});

        expect(options.username).toEqual(obj.username);
        expect(options.password).toEqual(obj.password);
    });
});
