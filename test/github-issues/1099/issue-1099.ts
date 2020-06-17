import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {AuroraDataApiDriver} from "../../../src/driver/aurora-data-api/AuroraDataApiDriver.ts";
import {SapDriver} from "../../../src/driver/sap/SapDriver.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Animal} from "./entity/Animal.ts";
import {Category} from "./entity/Category.ts";
import {OffsetWithoutLimitNotSupportedError} from "../../../src/error/OffsetWithoutLimitNotSupportedError.ts";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver.ts";

describe("github issues > #1099 BUG - QueryBuilder MySQL skip sql is wrong", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Animal, Category],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("drivers which does not support offset without limit should throw an exception, other drivers must work fine", () => Promise.all(connections.map(async connection => {
        let animals = ["cat", "dog", "bear", "snake"];
        for (let animal of animals) {
            await connection.getRepository(Animal).save({name: animal});
        }

        const qb = connection.getRepository(Animal)
            .createQueryBuilder("a")
            .leftJoinAndSelect("a.categories", "categories")
            .orderBy("a.id")
            .skip(1);

        if (connection.driver instanceof MysqlDriver || connection.driver instanceof AuroraDataApiDriver  || connection.driver instanceof SapDriver ) {
            let error;
            try {
                await qb.getManyAndCount();
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceOf(OffsetWithoutLimitNotSupportedError);
        } else {
            expect(await qb.getManyAndCount()).to.eql([[{ id: 2, name: "dog", categories: [] }, { id: 3, name: "bear", categories: [] }, { id: 4, name: "snake", categories: [] }, ], 4]);
        }
    })));

});

runIfMain(import.meta);
