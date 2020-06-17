import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Animal} from "./entity/Animal.ts";
import {Category} from "./entity/Category.ts";
import {NamingStrategyUnderTest} from "./naming/NamingStrategyUnderTest.ts";
import {ColumnMetadata} from "../../../src/metadata/ColumnMetadata.ts";


describe("github issue > #1282 FEATURE REQUEST - Naming strategy joinTableColumnName if it is called from the owning or owned (inverse) context ", () => {

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

        let metadata = connection.getManyToManyMetadata(Animal, "categories");

        let columns:  ColumnMetadata[];
        if (metadata !== undefined) {
            columns = metadata.columns;
        } else {
            columns = [];
        }

        expect(columns.find((column: ColumnMetadata) => column.databaseName === "animalIdForward"))
            .not.to.be.undefined;

        expect(columns.find((column: ColumnMetadata) => column.databaseName === "categoryIdInverse"))
            .not.to.be.undefined;

    })));

});

runIfMain(import.meta);
