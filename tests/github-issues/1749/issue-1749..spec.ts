import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Bar} from "./entity/Bar";

describe("github issues > #1749 Can't delete tables in non-default schema", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"]
    }));

    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should delete entites from tables in different schemas", () => Promise.all(connections.map(async connection => {
        const bar = new Bar();
        const persistedBar = await connection.manager.save(bar);

        await connection.manager.delete(Bar, persistedBar.id);

    })));

});
