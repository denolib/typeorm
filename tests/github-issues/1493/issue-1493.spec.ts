import { DriverUtils } from "../../../src/driver/DriverUtils";
// import {exec} from "child_process";

describe("github issues > #1493 Error parsing pg connection string", () => {

    test("should parse common connection url", () => {
        const obj: any = {
            username: "username",
            password: "password",
            host: "host",
            database: "database",
            port: 8888
        };
        const url = `postgres://${obj.username}:${obj.password}@${obj.host}:${obj.port}/${obj.database}`;
        const options = DriverUtils.buildDriverOptions({url});

        for (const key of Object.keys(obj)) {
            expect(options[key]).toEqual(obj[key]);
        }
    });

    test("should parse url with password contains colons", () => {
        const obj: any = {
            username: "username",
            password: "pas:swo:rd",
            host: "host",
            database: "database",
            port: 8888
        };
        const url = `postgres://${obj.username}:${obj.password}@${obj.host}:${obj.port}/${obj.database}`;
        const options = DriverUtils.buildDriverOptions({url});

        expect(options.password).toEqual(obj.password);
    });

    test("should parse url with username and password contains at signs", () => {
        const obj: any = {
            username: "usern@me",
            password: "p@ssword",
            host: "host",
            database: "database",
            port: 8888
        };
        const url = `postgres://${obj.username}:${obj.password}@${obj.host}:${obj.port}/${obj.database}`;
        const options = DriverUtils.buildDriverOptions({url});

        expect(options.username).toEqual(obj.username);
        expect(options.password).toEqual(obj.password);
    });
});
