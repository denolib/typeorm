import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { Human } from "./entity/Human.ts";
import { Animal } from "./entity/Animal.ts";
import { Gender } from "./entity/GenderEnum.ts";
import { EntityManager } from "../../../src/entity-manager/EntityManager.ts";

describe("github issues > #4106 Specify enum type name in postgres", () => {
    let connections: Connection[];
    before(
        async () =>
            (connections = await createTestingConnections({
                entities: [Human, Animal],
                dropSchema: true,
                enabledDrivers: ["postgres"],
            }))
    );
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    async function prepareData(connection: Connection) {
        const human = new Human();
        human.id = 1;
        human.name = "Jane Doe";
        human.gender = Gender.female;
        await connection.manager.save(human);

        const animal = new Animal();
        animal.id = 1;
        animal.name = "Miko";
        animal.specie = "Turtle";
        animal.gender = Gender.male;
        await connection.manager.save(animal);
    }

    it("should create an enum with the name specified in column options -> enumName", () =>
        Promise.all(
            connections.map(async connection => {
                const em = new EntityManager(connection);
                const types = await em.query(`SELECT typowner, n.nspname as "schema",
                    pg_catalog.format_type(t.oid, NULL) AS "name",
                    pg_catalog.obj_description(t.oid, 'pg_type') as "description"
                    FROM pg_catalog.pg_type t
                        LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
                    WHERE (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid))
                        AND NOT EXISTS(SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid)
                        AND pg_catalog.pg_type_is_visible(t.oid)
                        AND n.nspname = 'public'
                    ORDER BY 1, 2;`);

                // Enum name must be exactly the same as stated
                // Quoted here since the name contains mixed case
                expect(types.some((type: any) => type.name === `"genderEnum"`)).to.be.true;
            })
        ));

    it("should insert data with the correct enum", () =>
        Promise.all(
            connections.map(async connection => {
                await prepareData(connection);

                const em = new EntityManager(connection);

                const humanTable = await em.query(`SELECT column_name as "columnName", data_type as "dataType", udt_name as "udtName" FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'human'
                    ORDER BY ordinal_position;`);
                const animalTable = await em.query(`SELECT column_name as "columnName", data_type as "dataType", udt_name as "udtName" FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'animal'
                    ORDER BY ordinal_position;`);

                expect(humanTable[2].dataType).to.equal("USER-DEFINED");
                expect(humanTable[2].udtName).to.equal("genderEnum");

                expect(animalTable[2].dataType).to.equal("USER-DEFINED");
                expect(animalTable[2].udtName).to.equal("genderEnum");

                const HumanRepository = connection.manager.getRepository(Human);
                const AnimalRepository = connection.manager.getRepository(Animal);

                const human = await HumanRepository.find();
                const animal = await AnimalRepository.find();

                expect(human[0].gender).to.equal("female");
                expect(animal[0].gender).to.equal("male");
            })
        ));


});

runIfMain(import.meta);
