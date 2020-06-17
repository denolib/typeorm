import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Config} from "./entity/config.entity.ts";
import {Item} from "./entity/item.entity.ts";

describe("github issues > #4697 Revert migrations running in reverse order.", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [Config, Item],
        migrations: [joinPaths(__dirname, "/migration/*.ts")],
        enabledDrivers: ["mongodb"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should revert migrations in the right order", () => Promise.all(connections.map(async connection => {
        await connection.runMigrations();

        await connection.undoLastMigration();

        const [lastMigration] = await connection.runMigrations();

        lastMigration.should.have.property("timestamp", 1567689639607);
        lastMigration.should.have.property("name", "MergeConfigs1567689639607");
    })));
});

runIfMain(import.meta);
