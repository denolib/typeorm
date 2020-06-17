import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Cat} from "./entity/Cat.ts";
import {Dog} from "./entity/Dog.ts";

describe("github issues > #620 Feature Request: Flexibility in Foreign Key names", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Cat, Dog],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work as expected", () => Promise.all(connections.map(async connection => {

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

        loadedCat!.id.should.be.equal(1);
        loadedCat!.dog.DogID.should.be.equal("Simba");
    })));

});

runIfMain(import.meta);
