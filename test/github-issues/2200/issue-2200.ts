import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Booking} from "./entity/Booking.ts";
import {NamingStrategyUnderTest} from "./naming/NamingStrategyUnderTest.ts";


describe("github issue > #2200 Bug - Issue with snake_case naming strategy", () => {

    let connections: Connection[];
    let namingStrategy = new NamingStrategyUnderTest();
    const __dirname = getDirnameOfCurrentModule(import.meta);

    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        namingStrategy
    }));
    beforeEach(() => {
        return reloadTestingDatabases(connections);
    });
    after(() => closeTestingConnections(connections));


    it("Renammed alias allow to query correctly", () => Promise.all(connections.map(async connection => {
        await connection.getRepository(Booking).find({take: 10});
    })));

});

runIfMain(import.meta);
