import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Migration} from "../../../src/migration/Migration";

describe("github issues > #2875 runMigrations() function is not returning a list of migrated files", () => {
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        migrations: [__dirname + "/migration/*.js"],
        enabledDrivers: ["postgres"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should be able to run all necessary migrations", () => Promise.all(connections.map(async connection => {
        const mymigr: Migration[] = await connection.runMigrations();
    
        expect(mymigr.length).toEqual(1);
        expect(mymigr[0].name).toEqual("InitUsers1530542855524");
    })));
 });
