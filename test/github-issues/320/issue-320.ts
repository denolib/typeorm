import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {ActivityEntity} from "./entity/ActivityEntity.ts";
import {TileEntity} from "./entity/TileEntity.ts";

describe("github issues > #320 Bug in getManyAndCount", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [ActivityEntity, TileEntity],
        enabledDrivers: ["mysql"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly parse type from PrimaryGeneratedColumn options", () => Promise.all(connections.map(async connection => {
        let tiles = [2, 3];

        let query = connection.createQueryBuilder(ActivityEntity, "activity")
            .innerJoinAndSelect("activity.tiles", "tile")
            .select("activity.id")
            .orderBy("activity.endDate", "DESC");

        query = query
            .innerJoin("(SELECT " +
                "COUNT(activityId) AS matchedTileCount, " +
                "tile_activities_activity.activityId " +
                "FROM tile " +
                "INNER JOIN tile_activities_activity " +
                "ON tile.id = tile_activities_activity.tileId " +
                "WHERE tile.id IN (:...tiles) " +
                "GROUP BY activityId)", "b", "b.activityId = activity.id")
            .addSelect("b.matchedTileCount")
            .addSelect("COUNT(activity.id) as tileCount")
            .groupBy("activity.id, tile.id")
            .having("b.matchedTileCount = :tileCount")
            .orHaving("tileCount <= b.matchedTileCount")
            .setParameter("tiles", tiles)
            .setParameter("tileCount", tiles.length);

        await query.getMany;
    })));

});

runIfMain(import.meta);
