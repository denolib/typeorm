import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Car} from "./entity/Car";
import {Fruit} from "./entity/Fruit";

describe("github issues > #363 Can't save 2 unrelated entity types in a single persist call", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("entityManager should allow you to save unrelated entities with one persist call", () => Promise.all(connections.map(async connection => {

        const car = new Car();
        car.name = "Ferrari";

        const fruit = new Fruit();
        fruit.name = "Banana";

        const [savedCar, savedFruit] = await connection.manager.save([car, fruit]);

        expect(savedFruit).toHaveProperty("name", "Banana");
        expect(savedFruit).toBeInstanceOf(Fruit);

        expect(savedCar).toHaveProperty("name", "Ferrari");
        expect(savedCar).toBeInstanceOf(Car);

        const cars = await connection.manager.find(Car);

        // before the changes in this PR, all the tests before this one actually passed
        expect(cars).toHaveLength(1);
        expect(cars[0]).toHaveProperty("name", "Ferrari");

        const fruits = await connection.manager.find(Fruit);

        expect(fruits).toHaveLength(1);
        expect(fruits[0]).toHaveProperty("name", "Banana");

    })));

    test("entityManager should allow you to delete unrelated entities with one remove call", () => Promise.all(connections.map(async connection => {

        const fruit = new Fruit();
        fruit.name = "Banana";

        const fruit2 = new Fruit();
        fruit2.name = "Apple";

        const [savedFruit] = await connection.manager.save([fruit, fruit2]);

        const car = new Car();
        car.name = "Ferrari";

        const savedCar = await connection.manager.save(car);

        await connection.manager.remove([savedCar, savedFruit]);

        const cars = await connection.manager.find(Car);

        expect(cars).toHaveLength(0);

        const fruits = await connection.manager.find(Fruit);

        expect(fruits).toHaveLength(1);
        expect(fruits[0]).toHaveProperty("name", "Apple");

    })));

});
