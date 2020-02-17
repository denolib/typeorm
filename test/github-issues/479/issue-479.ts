import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Car} from "./entity/Car.ts";

describe("github issues > #479 orWhere breaks skip / take", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("where expression of the skip/take should not break original where query", () => Promise.all(connections.map(async connection => {

        const car1 = new Car();
        car1.name = "Test1";
        const car2 = new Car();
        car2.name = "Test2";
        const car3 = new Car();
        car3.name = "Test3";
        const car4 = new Car();
        car4.name = "BMW";
        const car5 = new Car();
        car5.name = "Mercedes";
        const car6 = new Car();
        car6.name = "Porshe";

        await connection
            .getRepository(Car)
            .save([car1, car2, car3, car4, car5, car6]);

        const cars = await connection
            .getRepository(Car)
            .createQueryBuilder("car")
            .where("car.name LIKE :filter1", { filter1: "Test%" })
            .orWhere("car.name LIKE :filter2", { filter2: "BM%" })
            .orderBy("car.id")
            .skip(0)
            .take(1)
            .getMany();

        expect(cars.length).to.be.equal(1);
    })));

});

runIfMain(import.meta);
