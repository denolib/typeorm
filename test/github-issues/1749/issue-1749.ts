import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Bar} from "./entity/Bar.ts";

describe("github issues > #1749 Can't delete tables in non-default schema", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        enabledDrivers: ["postgres"]
    }));

    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should delete entites from tables in different schemas", () => Promise.all(connections.map(async connection => {
        const bar = new Bar();
        const persistedBar = await connection.manager.save(bar);

        await connection.manager.delete(Bar, persistedBar.id);

    })));

});

runIfMain(import.meta);
