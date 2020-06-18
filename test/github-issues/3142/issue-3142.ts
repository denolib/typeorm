import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {Contact} from "./entity/Contact.ts";
import {Person} from "./entity/Person.ts";

describe("github issues > #3142 Unique constraint not created on embedded entity field", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [Contact, Person],
        subscribers: [joinPaths(__dirname, "/subscriber/*.ts")],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should create unique constraint on embedded entity", () => Promise.all(connections.map(async function(connection) {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        expect(table!.uniques.length).to.be.equal(2);
        const contactUnique = table!.uniques.find(unique => unique.columnNames.indexOf("email") !== 0);
        expect(contactUnique).to.exist;

    })));

});

runIfMain(import.meta);
