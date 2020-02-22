import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {Thing, EmbeddedInThing} from "./entity/thing.ts";

describe("github issues > #1825 Invalid field values being loaded with long camelCased embedded field names.", () => {
    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => (connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["mysql", "postgres", "mariadb"]
        }))
    );
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should load valid values in embedded with long field names", () => Promise.all(connections.map(async connection => {
        const thingRepository = connection.getRepository(Thing);

        const thing = new Thing();
        const embeddedThing = new EmbeddedInThing();
        embeddedThing.someSeriouslyLongFieldNameFirst = 1;
        embeddedThing.someSeriouslyLongFieldNameSecond = 2;
        thing.embeddedThing = embeddedThing;

        await thingRepository.save(thing);

        const loadedThing = await thingRepository.findOne(thing.id);

        expect(loadedThing).to.eql(thing);
    })));
});

runIfMain(import.meta);
