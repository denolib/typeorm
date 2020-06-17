import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Author} from "./entity/Author.ts";
import {Abbreviation} from "./entity/Abbreviation.ts";

describe("github issues > #215 invalid replacements of join conditions", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Abbreviation, Author, Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not do invalid replacements of join conditions", () => Promise.all(connections.map(async connection => {

        const author = new Author();
        author.name = "John Doe";
        await connection.manager.save(author);

        const abbrev = new Abbreviation();
        abbrev.name = "test";
        await connection.manager.save(abbrev);

        const post = new Post();
        post.author = author;
        post.abbreviation = abbrev;
        await connection.manager.save(post);

        // generated query should end with "ON p.abbreviation_id = ab.id"
        // not with ON p.abbreviation.id = ab.id (notice the dot) which would
        // produce an error.
        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "p")
            .leftJoinAndMapOne("p.author", Author, "n", "p.author_id = n.id")
            .leftJoinAndMapOne("p.abbreviation", Abbreviation, "ab", "p.abbreviation_id = ab.id")
            .getMany();

        loadedPosts.length.should.be.equal(1);
    })));

});

runIfMain(import.meta);
