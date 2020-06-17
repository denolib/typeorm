import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {User} from "./entity/User.ts";
import {TournamentParticipant} from "./entity/TournamentParticipant.ts";
import {TournamentUserParticipant} from "./entity/TournamentUserParticipant.ts";
import {TournamentSquadParticipant} from "./entity/TournamentSquadParticipant.ts";

describe("github issues > #1972 STI problem - empty columns", () => {
    let connections: Connection[];

    before(async () => connections = await createTestingConnections({
        entities: [TournamentParticipant, TournamentSquadParticipant, TournamentUserParticipant, User],
    }));

    beforeEach(() => reloadTestingDatabases(connections));

    after(() => closeTestingConnections(connections));

    it("should insert with userId", () => Promise.all(connections.map(async connection => {
        // create user
        const user = new User({
            name: "test",
        });
        await connection.manager.save(user);

        // create user participant
        const tournamentUserParticipant = new TournamentUserParticipant({
            user,
        });
        await connection.manager.save(tournamentUserParticipant);

        // find user participant in the DB
        const result = await connection.manager.findOne(TournamentUserParticipant);

        if (result) {
            expect(result.user).to.be.instanceof(User);
        }
    })));

    it("should insert with ownerId", () => Promise.all(connections.map(async connection => {
        // create user
        const user = new User({
            name: "test",
        });
        await connection.manager.save(user);

        // create tournament squad participant
        const tournamentSquadParticipant = new TournamentSquadParticipant({
            users: [ user ],
            owner: user,
        });
        await connection.manager.save(tournamentSquadParticipant);

        // find squad participant in the DB
        const result = await connection.manager.findOne(TournamentSquadParticipant);

        if (result) {
            expect(result.owner).to.be.instanceof(User);
        }
    })));
});

runIfMain(import.meta);
