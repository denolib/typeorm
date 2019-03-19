import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("github issues > #1259 Can't sort by fields added with addSelect", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should order by added selects when pagination is used", () => Promise.all(connections.map(async connection => {

        const categories = [new Category(), new Category()];
        await connection.manager.save(categories);

        const posts: Post[] = [];
        for (let i = 0; i < 10; i++) {
            const post = new Post();
            if (i > 5 && i < 8) {
                post.name = `timber`;
            } else {
                post.name = `Tim${i}ber`;
            }
            post.count = 2;
            post.categories = categories;
            posts.push(post);
        }
        await connection.manager.save(posts);

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .addSelect("ts_rank_cd(to_tsvector(post.name), to_tsquery(:query))", "rank")
            .leftJoinAndSelect("post.categories", "categories")
            .orderBy("rank", "DESC")
            // .addOrderBy("post.id")
            .take(5)
            .setParameter("query", "timber")
            .getMany();

        expect(loadedPosts.length).toEqual(5);
        expect(loadedPosts[0].id).toEqual(7);
        expect(loadedPosts[0].name).toEqual("timber");
        expect(loadedPosts[1].id).toEqual(8);
        expect(loadedPosts[1].name).toEqual("timber");
    })));

    test("should order by added selects when pagination is used", () => Promise.all(connections.map(async connection => {

        const categories = [new Category(), new Category()];
        await connection.manager.save(categories);

        const posts: Post[] = [];
        for (let i = 0; i < 10; i++) {
            const post = new Post();
            post.name = `timber`;
            post.count = i * -1;
            post.categories = categories;
            posts.push(post);
        }
        await connection.manager.save(posts);

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .addSelect("post.count * 2", "doublecount")
            .leftJoinAndSelect("post.categories", "categories")
            .orderBy("doublecount")
            .take(5)
            .getMany();

        expect(loadedPosts.length).toEqual(5);
        expect(loadedPosts[0].id).toEqual(10);
        expect(loadedPosts[1].id).toEqual(9);
        expect(loadedPosts[2].id).toEqual(8);
        expect(loadedPosts[3].id).toEqual(7);
        expect(loadedPosts[4].id).toEqual(6);
    })));

});
