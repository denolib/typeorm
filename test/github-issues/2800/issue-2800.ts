import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/index.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Car} from "./entity/Car.ts";
import {Plane} from "./entity/Plane.ts";

describe("github issues > #2800 - Can't override embedded entities in STI implementation", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);

    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        schemaCreate: true,
        dropSchema: true
    }));

    beforeEach(() => reloadTestingDatabases(connections));

    after(() => closeTestingConnections(connections));

    it("should be able to save entity with embedded entities overriding", () => Promise.all(connections.map(async connection => {
        await connection.manager.save(Car, connection.manager.create(Car, {
            engine: {
                horsePower: 42,
                torque: 42
            }
        }));
        await connection.manager.save(Plane, connection.manager.create(Plane, {
            engine: {
                beep: 42,
                boop: 42
            }
        }));
    })));

});

runIfMain(import.meta);
