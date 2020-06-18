import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/index.ts";
import { EntityMetadata } from "../../../src/index.ts";
import { Person } from "./entity/person.ts";

describe("github issues > #197 Fails to drop indexes when removing fields", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Person],
        schemaCreate: false,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("it should drop the column and the referenced index", () => Promise.all(connections.map(async connection => {

        let entityMetadata: EntityMetadata = connection.getMetadata(Person);
        let idx: number = entityMetadata.columns.findIndex(x => x.databaseName === "firstname");
        entityMetadata.columns.splice(idx, 1);
        entityMetadata.indices = []; // clear the referenced index from metadata too

        await connection.synchronize(false);
    })));

});

runIfMain(import.meta);
