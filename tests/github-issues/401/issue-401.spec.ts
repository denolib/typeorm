import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Player} from "./entity/Player";
import {Group} from "./entity/Group";

describe("github issues > #401 special keywords should be escaped in join queries", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should escape 'group' keyword properly", () => Promise.all(connections.map(async connection => {

        const group = new Group();
        group.name = "about players";
        await connection.manager.save(group);

        const player = new Player();
        player.email = "player@gmail.com";
        player.group = group;
        await connection.manager.save(player);

        const loadedPlayer = await connection
            .getRepository(Player)
            .createQueryBuilder("player")
            .leftJoinAndSelect("player.group", "group")
            .where("player.email = :email", { email: "player@gmail.com" })
            .getOne();

        expect(loadedPlayer).toEqual({
            email: "player@gmail.com",
            group: {
                id: 1,
                name: "about players"
            }
        });
    })));

});
