import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Thing, EmbeddedInThing} from "./entity/thing";

describe("github issues > #1825 Invalid field values being loaded with long camelCased embedded field names.", () => {
    let connections: Connection[];
    beforeAll(async () => (connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql", "postgres", "mariadb"]
        }))
    );
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should load valid values in embedded with long field names", () => Promise.all(connections.map(async connection => {
        const thingRepository = connection.getRepository(Thing);

        const thing = new Thing();
        const embeddedThing = new EmbeddedInThing();
        embeddedThing.someSeriouslyLongFieldNameFirst = 1;
        embeddedThing.someSeriouslyLongFieldNameSecond = 2;
        thing.embeddedThing = embeddedThing;

        await thingRepository.save(thing);

        const loadedThing = await thingRepository.findOne(thing.id);

        expect(loadedThing).toEqual(thing);
    })));
});
