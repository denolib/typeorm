import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {
    Any,
    Between,
    Connection,
    Equal,
    In,
    IsNull,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
    Not,
    PromiseUtils
} from "../../../../src/index.ts";
import {Post} from "./entity/Post.ts";
// TODO(uki00a) uncomment this when PostgresDriver is implemented.
// import {PostgresDriver} from "../../../../src/driver/postgres/PostgresDriver.ts";
import {Raw} from "../../../../src/find-options/operator/Raw.ts";
import {PersonAR} from "./entity/PersonAR.ts";

describe("repository > find options > operators", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [PersonAR, Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("not", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not("About #1")
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("lessThan", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: LessThan(10)
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("lessThanOrEqual", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);
        const post3 = new Post();
        post3.title = "About #3";
        post3.likes = 13;
        await connection.manager.save(post3);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: LessThanOrEqual(12)
        });
        loadedPosts.should.be.eql([
            { id: 1, likes: 12, title: "About #1" },
            { id: 2, likes: 3, title: "About #2" }
        ]);

    })));

    it("not(lessThan)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Not(LessThan(10))
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("not(lessThanOrEqual)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);
        const post3 = new Post();
        post3.title = "About #3";
        post3.likes = 13;
        await connection.manager.save(post3);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Not(LessThanOrEqual(12))
        });
        loadedPosts.should.be.eql([{ id: 3, likes: 13, title: "About #3" }]);

    })));

    it("moreThan", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: MoreThan(10)
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("moreThanOrEqual", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);
        const post3 = new Post();
        post3.title = "About #3";
        post3.likes = 13;
        await connection.manager.save(post3);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: MoreThanOrEqual(12)
        });
        loadedPosts.should.be.eql([
            { id: 1, likes: 12, title: "About #1" },
            { id: 3, likes: 13, title: "About #3" }
        ]);

    })));

    it("not(moreThan)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Not(MoreThan(10))
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(moreThanOrEqual)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);
        const post3 = new Post();
        post3.title = "About #3";
        post3.likes = 13;
        await connection.manager.save(post3);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Not(MoreThanOrEqual(12))
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("equal", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Equal("About #2")
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(equal)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(Equal("About #2"))
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("like", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Like("%out #%")
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }, { id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(like)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(Like("%out #1"))
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("between", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts1 = await connection.getRepository(Post).find({
            likes: Between(1, 10)
        });
        loadedPosts1.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

        const loadedPosts2 = await connection.getRepository(Post).find({
            likes: Between(10, 13)
        });
        loadedPosts2.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

        const loadedPosts3 = await connection.getRepository(Post).find({
            likes: Between(1, 20)
        });
        loadedPosts3.should.be.eql([{ id: 1, likes: 12, title: "About #1" }, { id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(between)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts1 = await connection.getRepository(Post).find({
            likes: Not(Between(1, 10))
        });
        loadedPosts1.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

        const loadedPosts2 = await connection.getRepository(Post).find({
            likes: Not(Between(10, 13))
        });
        loadedPosts2.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

        const loadedPosts3 = await connection.getRepository(Post).find({
            likes: Not(Between(1, 20))
        });
        loadedPosts3.should.be.eql([]);
    })));

    it("in", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: In(["About #2", "About #3"])
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(in)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(In(["About #1", "About #3"]))
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("any", () => Promise.all(connections.map(async connection => {
        if (true/*!(connection.driver instanceof PostgresDriver)*/) // TODO(uki00a) uncomment this when PostgresDriver is implemented.
            return;

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Any(["About #2", "About #3"])
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(any)", () => Promise.all(connections.map(async connection => {
        if (true/*!(connection.driver instanceof PostgresDriver)*/) // TODO(uki00a) uncomment this when PostgresDriver is implemented.
            return;

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(Any(["About #2", "About #3"]))
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("isNull", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = null as any;
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: IsNull()
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: null }]);

    })));

    it("not(isNull)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = null as any;
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(IsNull())
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("raw", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Raw("12")
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("raw (function)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Raw(columnAlias => "1 + " + columnAlias + " = 4")
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("should work with ActiveRecord model", () => PromiseUtils.runInSequence(connections, async connection => {
        PersonAR.useConnection(connection);

        const person = new PersonAR();
        person.name = "Timber";
        await connection.manager.save(person);

        const loadedPeople = await PersonAR.find({
            name: In(["Timber"])
        });
        expect(loadedPeople[0].name).to.be.equal("Timber");

    }));

});

runIfMain(import.meta);
