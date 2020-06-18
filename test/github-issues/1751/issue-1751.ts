import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {User} from "./entity/User.ts";

describe("github issues > #1751 Create sequence repeatedly when it already exists", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [User],
            enabledDrivers: ["postgres"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly synchronize schema", () => Promise.all(connections.map(async connection => {
        await connection.synchronize();
    })));

});

runIfMain(import.meta);
