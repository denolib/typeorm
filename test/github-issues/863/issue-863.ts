import { runIfMain } from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";

import { Master } from "./entities/master.ts";
import { Detail } from "./entities/detail.ts";

describe("indices > create schema", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Master, Detail],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    describe("build schema", function () {

        it("it should just work, creating the index", () => Promise.all(connections.map(async connection => {

            await connection.synchronize(true);

        })));

    });

});

runIfMain(import.meta);
