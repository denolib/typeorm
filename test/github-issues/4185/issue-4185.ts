import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #4185 afterLoad() subscriber interface missing additional info available on other events", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        subscribers: [joinPaths(__dirname, "/subscriber/*.ts")],
        schemaCreate: true,
        dropSchema: true
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should invoke afterLoad() with LoadEvent", () => Promise.all(connections.map(async connection => {
        const post1 = new Post();
        post1.id = 1;
        const post2 = new Post();
        post2.id = 2;
        await connection.manager.save([post1, post2]);

        const entities = await connection.manager
            .getRepository(Post)
            .find();
        expect(entities).to.have.lengthOf(2);
        for (const entity of entities) {
            expect(entity.simpleSubscriberSaw).not.to.be.undefined;
            const event = entity.extendedSubscriberSaw;
            expect(event).not.to.be.undefined;
            expect(event!.connection).to.equal(connection);
            expect(event!.queryRunner).not.to.be.undefined;
            expect(event!.manager).not.to.be.undefined;
            expect(event!.entity).to.equal(entity);
            expect(event!.metadata).not.to.be.undefined;
        }
    })));
});

runIfMain(import.meta);
