import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {Category} from "./entity/Category.ts";
import {Note} from "./entity/Note.ts";

describe("github issues > #3151 'uuid' in PrimaryGeneratedColumn causes Many-to-Many Relationship to Fail", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Note],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work correctly", () => Promise.all(connections.map(async connection => {
        await connection.synchronize();
    })));

});

runIfMain(import.meta);
