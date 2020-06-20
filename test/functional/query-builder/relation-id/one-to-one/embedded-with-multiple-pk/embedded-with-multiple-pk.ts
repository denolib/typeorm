import {runIfMain} from "../../../../../deps/mocha.ts";
import {expect} from "../../../../../deps/chai.ts";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../utils/test-utils.ts";
import {Connection} from "../../../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";
import {Counters} from "./entity/Counters.ts";
import {User} from "./entity/User.ts";
import {Subcounters} from "./entity/Subcounters.ts";

describe("query builder > relation-id > one-to-one > embedded-with-multiple-pk", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Counters, Post, Subcounters, User],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should load ids when loadRelationIdAndMap used on embedded table and each table have primary key", () => Promise.all(connections.map(async connection => {

        const user1 = new User();
        user1.id = 1;
        user1.name = "Alice";
        await connection.manager.save(user1);

        const user2 = new User();
        user2.id = 2;
        user2.name = "Bob";
        await connection.manager.save(user2);

        const category1 = new Category();
        category1.id = 1;
        category1.name = "cars";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.id = 2;
        category2.name = "airplanes";
        await connection.manager.save(category2);

        const post1 = new Post();
        post1.id = 1;
        post1.title = "About BMW";
        post1.counters = new Counters();
        post1.counters.code = 111;
        post1.counters.likes = 1;
        post1.counters.comments = 2;
        post1.counters.favorites = 3;
        post1.counters.category = category1;
        post1.counters.subcounters = new Subcounters();
        post1.counters.subcounters.version = 1;
        post1.counters.subcounters.watches = 2;
        post1.counters.subcounters.watchedUser = user1;
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.id = 2;
        post2.title = "About Boeing";
        post2.counters = new Counters();
        post2.counters.code = 222;
        post2.counters.likes = 3;
        post2.counters.comments = 4;
        post2.counters.favorites = 5;
        post2.counters.category = category2;
        post2.counters.subcounters = new Subcounters();
        post2.counters.subcounters.version = 1;
        post2.counters.subcounters.watches = 1;
        post2.counters.subcounters.watchedUser = user2;
        await connection.manager.save(post2);

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .loadRelationIdAndMap("post.counters.categoryId", "post.counters.category")
            .loadRelationIdAndMap("post.counters.subcounters.watchedUserId", "post.counters.subcounters.watchedUser")
            .orderBy("post.id")
            .getMany();

        expect(loadedPosts[0].should.be.eql(
            {
                id: 1,
                title: "About BMW",
                counters: {
                    code: 111,
                    likes: 1,
                    comments: 2,
                    favorites: 3,
                    categoryId: { id: 1, name: "cars"},
                    subcounters: {
                        version: 1,
                        watches: 2,
                        watchedUserId: { id: 1, name: "Alice"}
                    }
                }
            }
        ));
        expect(loadedPosts[1].should.be.eql(
            {
                id: 2,
                title: "About Boeing",
                counters: {
                    code: 222,
                    likes: 3,
                    comments: 4,
                    favorites: 5,
                    categoryId: { id: 2, name: "airplanes"},
                    subcounters: {
                        version: 1,
                        watches: 1,
                        watchedUserId: { id: 2, name: "Bob"}
                    }
                }
            }
        ));

        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .loadRelationIdAndMap("post.counters.categoryId", "post.counters.category")
            .loadRelationIdAndMap("post.counters.subcounters.watchedUserId", "post.counters.subcounters.watchedUser")
            .where("post.id = :id", { id: 1 })
            .andWhere("post.counters.code = :code", { code: 111 })
            .andWhere("post.counters.subcounters.version = :version", { version: 1 })
            .getOne();

        expect(loadedPost!.should.be.eql(
            {
                id: 1,
                title: "About BMW",
                counters: {
                    code: 111,
                    likes: 1,
                    comments: 2,
                    favorites: 3,
                    categoryId: { id: 1, name: "cars"},
                    subcounters: {
                        version: 1,
                        watches: 2,
                        watchedUserId: { id: 1, name: "Alice"}
                    }
                }
            }
        ));

    })));

});

runIfMain(import.meta);
