import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Race} from "./entity/Race.ts";
import {Duration} from "./entity/Duration.ts";

describe("github issues > embeddeds with custom column name don't work", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Duration, Race],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("embedded with custom column name should persist and load without errors", () => Promise.all(connections.map(async connection => {

        const race = new Race();
        race.name = "National Race";
        race.duration = new Duration();
        race.duration.durationDays = 1;
        race.duration.durationHours = 10;
        race.duration.durationMinutes = 30;

        await connection.manager.save(race);

        const loadedRace = await connection.manager.findOne(Race, { name: "National Race" });
        expect(loadedRace).to.be.not.undefined;
        expect(loadedRace!.id).to.be.not.undefined;
        expect(loadedRace!.duration).to.be.not.undefined;
        loadedRace!.name.should.be.equal("National Race");
        loadedRace!.duration.should.be.instanceOf(Duration);
        loadedRace!.duration.durationDays.should.be.equal(1);
        loadedRace!.duration.durationHours.should.be.equal(10);
        loadedRace!.duration.durationMinutes.should.be.equal(30);

    })));

});

runIfMain(import.meta);
