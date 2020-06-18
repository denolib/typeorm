import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {Post} from "./entity/Post.ts";
import {Counters} from "./entity/Counters.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {
    getDirnameOfCurrentModule,
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases,
    sleep
} from "../../../utils/test-utils.ts";
import {Subcounters} from "../embedded-many-to-one-case2/entity/Subcounters.ts";

describe("embedded > embedded-with-special-columns", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Counters, Post, Subcounters],
        // TODO(uki00a) Remove `enableDrivers` option when deno-sqlite supports `datetime('now')`.
        // deno-sqlite currently does not support `datetime('now')`. This is due to lack of support for getting current time in WASI.
        // @see https://github.com/dyedgreen/deno-sqlite/blob/a68be951b8a09e5df3eb76a1659d93e18ba048c5/build/src/vfs.c#L235
        enabledDrivers: ["postgres", "mysql", "mssql", "oracle"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should insert, load, update and remove entities with embeddeds when embeds contains special columns (e.g. CreateDateColumn, UpdateDateColumn, VersionColumn", () => Promise.all(connections.map(async connection => {

        const post1 = new Post();
        post1.id = 1;
        post1.title = "About cars";
        post1.counters = new Counters();
        post1.counters.comments = 1;
        post1.counters.favorites = 2;
        post1.counters.likes = 3;
        post1.counters.subcounters = new Subcounters();
        post1.counters.subcounters.watches = 5;
        await connection.getRepository(Post).save(post1);

        const post2 = new Post();
        post2.id = 2;
        post2.title = "About airplanes";
        post2.counters = new Counters();
        post2.counters.comments = 2;
        post2.counters.favorites = 3;
        post2.counters.likes = 4;
        post2.counters.subcounters = new Subcounters();
        post2.counters.subcounters.watches = 10;
        await connection.getRepository(Post).save(post2);

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .orderBy("post.id")
            .getMany();

        expect(loadedPosts[0].counters.createdDate.should.be.instanceof(Date));
        expect(loadedPosts[0].counters.updatedDate.should.be.instanceof(Date));
        expect(loadedPosts[0].counters.subcounters.version.should.be.equal(1));
        expect(loadedPosts[1].counters.createdDate.should.be.instanceof(Date));
        expect(loadedPosts[1].counters.updatedDate.should.be.instanceof(Date));
        expect(loadedPosts[1].counters.subcounters.version.should.be.equal(1));

        let loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .orderBy("post.id")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost!.counters.createdDate.should.be.instanceof(Date));
        expect(loadedPost!.counters.updatedDate.should.be.instanceof(Date));
        expect(loadedPost!.counters.subcounters.version.should.be.equal(1));

        const prevUpdateDate = loadedPost!.counters.updatedDate;

        loadedPost!.title = "About cars #2";

        await sleep(1000);
        await connection.getRepository(Post).save(loadedPost!);

        loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect((loadedPost!.counters.updatedDate.valueOf()).should.be.greaterThan(prevUpdateDate.valueOf()));
        expect(loadedPost!.counters.subcounters.version.should.be.equal(2));

    })));

});

runIfMain(import.meta);
