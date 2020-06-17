import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/index.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Car, CarEngine} from "./entity/Car.ts";
import {Plane, PlaneEngine} from "./entity/Plane.ts";
import {Vehicle, Engine} from "./entity/Vehicle.ts";

describe("github issues > #2800 - Can't override embedded entities in STI implementation", () => {

    let connections: Connection[];

    before(async () => connections = await createTestingConnections({
        entities: [Car, CarEngine, Plane, PlaneEngine, Vehicle, Engine],
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
