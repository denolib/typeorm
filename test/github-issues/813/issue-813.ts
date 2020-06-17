import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver.ts";
import {Category} from "./entity/Category.ts";

describe("github issues > #813 order by must support functions", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work perfectly", () => Promise.all(connections.map(async connection => {
        if (!(connection.driver instanceof MysqlDriver))
            return;

        const categories = [new Category(), new Category()];
        await connection.manager.save(categories);

        const post = new Post();
        post.title = "About order by";
        post.categories = categories;
        await connection.manager.save(post);

        const posts = await connection.createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .orderBy("RAND()")
            .getMany();

        posts[0].id.should.be.equal(1);
        posts[0].title.should.be.equal("About order by");
    })));

    it("should work perfectly with pagination as well", () => Promise.all(connections.map(async connection => {
        if (!(connection.driver instanceof MysqlDriver))
            return;

        const categories = [new Category(), new Category()];
        await connection.manager.save(categories);

        const post = new Post();
        post.title = "About order by";
        post.categories = categories;
        await connection.manager.save(post);

        const posts = await connection.createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .orderBy("RAND()")
            .skip(0)
            .take(1)
            .getMany();


        posts[0].id.should.be.equal(1);
        posts[0].title.should.be.equal("About order by");
    })));

});

runIfMain(import.meta);
