import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Person} from "./entity/person";
import {Note} from "./entity/note";

describe("github issues > #2965 Reuse preloaded lazy relations", () => {
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [ __dirname + "/entity/*{.js,.ts}" ],
        // use for manual validation
        // logging: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should resuse preloaded lazy relations", () => Promise.all(connections.map(async connection => {

        const repoPerson = connection.getRepository(Person);
        const repoNote = connection.getRepository(Note);

        const personA  = await repoPerson.create({ name: "personA" });
        const personB    = await repoPerson.create({ name: "personB" });

        await repoPerson.save([
            personA,
            personB,
        ]);

        await repoNote.insert({ label: "note1", owner: personA });
        await repoNote.insert({ label: "note2", owner: personB });


        const originalLoad: (...args: any[]) => Promise<any[]> = connection.relationLoader.load;
        let loadCalledCounter = 0;
        connection.relationLoader.load = (...args: any[]): Promise<any[]> => {
            loadCalledCounter++;
            return originalLoad.call(connection.relationLoader, ...args);
        };

        {
            const res = await repoPerson.find({ relations: ["notes"] });
            const personANotes = await res[0].notes;
            expect(loadCalledCounter).toEqual(0);
            expect(personANotes[0].label).toEqual("note1");
        }

        {
            const res = await repoPerson.find();
            const personBNotes = await res[1].notes;
            expect(loadCalledCounter).toEqual(1);
            expect(personBNotes[0].label).toEqual("note2");
        }
    })));

});
