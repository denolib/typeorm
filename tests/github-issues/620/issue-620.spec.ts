import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Cat} from "./entity/Cat";
import {Dog} from "./entity/Dog";

describe("github issues > #620 Feature Request: Flexibility in Foreign Key names", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should work as expected", () => Promise.all(connections.map(async connection => {

        const dog = new Dog();
        dog.DogID = "Simba";
        await connection.manager.save(dog);

        const cat = new Cat();
        cat.dog = dog;

        await connection.manager.save(cat);

        const loadedCat = await connection.manager
            .createQueryBuilder(Cat, "cat")
            .leftJoinAndSelect("cat.dog", "dog")
            .getOne();

        expect(loadedCat!.id).toEqual(1);
        expect(loadedCat!.dog.DogID).toEqual("Simba");
    })));

});
