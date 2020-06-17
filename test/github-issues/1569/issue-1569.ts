import { runIfMain } from "../../deps/mocha.ts";
import { expect } from "../../deps/chai.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Item, EmbeddedItem } from "./entity/Item.ts";

describe("github issue > #1569 updateById generates wrong SQL with arrays inside embeddeds", () => {

    let connections: Connection[] = [];
    before(async () => connections = await createTestingConnections({
        entities: [Item, EmbeddedItem],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should properly updateById arrays inside embeddeds", () => Promise.all(connections.map(async connection => {
        const item = new Item();
        item.someText = "some";
        const embedded = new EmbeddedItem();
        embedded.arrayInsideEmbedded = [1, 2, 3];
        item.embedded = embedded;

        await connection.getRepository(Item).save(item);

        await connection.getRepository(Item).update(item.id, {
            someText: "some2",
            embedded: {
                arrayInsideEmbedded: [1, 2],
            },
        });

        const loadedItem = await connection.getRepository(Item).findOne(item.id);

        expect(loadedItem!.embedded.arrayInsideEmbedded).to.eql([1, 2]);

    })));

});

runIfMain(import.meta);
