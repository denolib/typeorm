import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Animal} from "./entity/Animal";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver";

describe("github issues > #1099 BUG - QueryBuilder MySQL skip sql is wrong", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("drivers which does not support offset without limit should throw an exception, other drivers must work fine", () => Promise.all(connections.map(async connection => {
        let animals = ["cat", "dog", "bear", "snake"];
        for (let animal of animals) {
            await connection.getRepository(Animal).save({name: animal});
        }

        const qb = connection.getRepository(Animal)
            .createQueryBuilder("a")
            .leftJoinAndSelect("a.categories", "categories")
            .orderBy("a.id")
            .skip(1);

        if (connection.driver instanceof MysqlDriver) {
            await expect(qb.getManyAndCount()).rejects.toBeDefined();
        } else {
            await expect(qb.getManyAndCount()).resolves.toEqual([[{ id: 2, name: "dog", categories: [] }, { id: 3, name: "bear", categories: [] }, { id: 4, name: "snake", categories: [] }, ], 4]);
        }
    })));

});
