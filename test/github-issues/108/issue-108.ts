import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Project} from "./entity/Project.ts";
import {User} from "./entity/User.ts";

describe("github issues > #108 Error with constraint names on postgres", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Project, User],
        schemaCreate: true,
        dropSchema: true,
    }));
    after(() => closeTestingConnections(connections));

    it("should sync even when there unqiue constraints placed on similarly named columns", () => Promise.all(connections.map(async connection => {
       // By virtue that we got here means that it must have worked.
       expect(true).is.true;
    })));

});

runIfMain(import.meta);
