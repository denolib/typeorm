import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Race} from "./entity/Race";

describe("github issues > support of embeddeds that are not set", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("embedded with custom column name should persist and load without errors", () => Promise.all(connections.map(async connection => {

        const race = new Race();
        race.name = "National Race";

        await connection.manager.save(race);

        const loadedRace = await connection.manager.findOne(Race, { name: "National Race" });
        expect(loadedRace).toBeDefined();
        expect(loadedRace!.id).toBeDefined();
        expect(loadedRace!.name).toEqual("National Race");
        expect(loadedRace!.duration).toBeDefined();
        expect(loadedRace!.duration.minutes).toBeNull();
        expect(loadedRace!.duration.hours).toBeNull();
        expect(loadedRace!.duration.days).toBeNull();

    })));

});
