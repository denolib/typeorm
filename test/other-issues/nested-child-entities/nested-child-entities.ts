import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {TournamentGraph} from "./entity/TournamentGraph.ts";
import {SquadBilliardsTournament} from "./entity/SquadBilliardsTournament.ts";

describe("other issues > using nested child entities", () => {
    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);

    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        enabledDrivers: ["postgres"]
    }));

    beforeEach(() => reloadTestingDatabases(connections));

    after(() => closeTestingConnections(connections));

    it("should insert without error", () => Promise.all(connections.map(async connection => {
        const squadBilliardsTournament = new SquadBilliardsTournament({
            name: "Squad Tournament",
        });

        await connection.manager.save(squadBilliardsTournament);
        const tournamentGraph = new TournamentGraph();

        tournamentGraph.tournament = squadBilliardsTournament;

        await connection.manager.save(tournamentGraph);
    })));
});

runIfMain(import.meta);
