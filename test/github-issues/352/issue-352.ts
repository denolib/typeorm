import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {MssqlParameter} from "../../../src/driver/sqlserver/MssqlParameter.ts";

describe("github issues > #352 double precision round to int in mssql", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["mssql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("real number should be successfully stored and loaded from db including value in parameters", () => Promise.all(connections.map(async connection => {

        const posts: Post[] = [];
        for (let i = 1; i <= 25; i++) {
            const post = new Post();
            post.id = i + 0.234567789;
            post.title = "hello post";
            posts.push(post);
        }
        await connection.manager.save(posts);

        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: new MssqlParameter(1.234567789, "float") })
            .getOne();

        expect(loadedPost).to.exist;
        expect(loadedPost!.id).to.be.equal(1.234567789);

    })));

});

runIfMain(import.meta);
