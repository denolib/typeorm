import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver";
import {Category} from "./entity/Category";

describe("github issues > #813 order by must support functions", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should work perfectly", () => Promise.all(connections.map(async connection => {
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

        expect(posts[0].id).toEqual(1);
        expect(posts[0].title).toEqual("About order by");
    })));

    test("should work perfectly with pagination as well", () => Promise.all(connections.map(async connection => {
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


        expect(posts[0].id).toEqual(1);
        expect(posts[0].title).toEqual("About order by");
    })));

});
