import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Race} from "./entity/Race";
import {Duration} from "./entity/Duration";

describe("github issues > embeddeds with custom column name don't work", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("embedded with custom column name should persist and load without errors", () => Promise.all(connections.map(async connection => {

        const race = new Race();
        race.name = "National Race";
        race.duration = new Duration();
        race.duration.durationDays = 1;
        race.duration.durationHours = 10;
        race.duration.durationMinutes = 30;

        await connection.manager.save(race);

        const loadedRace = await connection.manager.findOne(Race, { name: "National Race" });
        expect(loadedRace).not.toBeUndefined();
        expect(loadedRace!.id).not.toBeUndefined();
        expect(loadedRace!.duration).not.toBeUndefined();
        expect(loadedRace!.name).toEqual("National Race");
        expect(loadedRace!.duration).toBeInstanceOf(Duration);
        expect(loadedRace!.duration.durationDays).toEqual(1);
        expect(loadedRace!.duration.durationHours).toEqual(10);
        expect(loadedRace!.duration.durationMinutes).toEqual(30);

    })));

});
