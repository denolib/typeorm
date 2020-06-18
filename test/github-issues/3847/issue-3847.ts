import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Animal} from "./entity/Animal.ts";
import {Category} from "./entity/Category.ts";
import {NamingStrategyUnderTest} from "./naming/NamingStrategyUnderTest.ts";


describe("github issues > #3847 FEATURE REQUEST - Naming strategy foreign key override name", () => {

    let connections: Connection[];
    let namingStrategy = new NamingStrategyUnderTest();

    before(async () => connections = await createTestingConnections({
        entities: [Animal, Category],
        namingStrategy
    }));
    beforeEach(() => {
        return reloadTestingDatabases(connections);
    });
    after(() => closeTestingConnections(connections));

    it("NamingStrategyUnderTest#", () => Promise.all(connections.map(async connection => {
        await connection.getRepository(Animal).find();

        let metadata = connection.getMetadata(Animal);

        expect(metadata.foreignKeys[0].name).to.eq("fk_animal_category_categoryId");
    })));
});

runIfMain(import.meta);
