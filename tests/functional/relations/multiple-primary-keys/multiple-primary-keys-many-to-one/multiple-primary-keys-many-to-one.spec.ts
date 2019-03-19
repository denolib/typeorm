import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("relations > multiple-primary-keys > many-to-one", () => {
    
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    describe("owning side", () => {

        test("should load related entity when JoinColumn is not specified", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            category2.type = "common-category";
            category2.code = 2;
            category2.version = 1;
            await connection.manager.save(category2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.category = category1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.category = category2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.category", "category")
                .orderBy("post.id")
                .getMany();

            expect(loadedPosts[0].category).not.toBeUndefined();
            expect(loadedPosts[0].category.name).toEqual("cars");
            expect(loadedPosts[0].category.type).toEqual("common-category");
            expect(loadedPosts[1].category).not.toBeUndefined();
            expect(loadedPosts[1].category.name).toEqual("airplanes");
            expect(loadedPosts[1].category.type).toEqual("common-category");

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.category", "category")
                .where("post.id = :id", {id: 1})
                .getOne();

            expect(loadedPost!.category).not.toBeUndefined();
            expect(loadedPost!.category.name).toEqual("cars");
            expect(loadedPost!.category.type).toEqual("common-category");

        })));

        test("should load related entity when JoinColumn is specified without options", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            category2.type = "common-category";
            category2.code = 2;
            category2.version = 1;
            await connection.manager.save(category2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.categoryWithJoinColumn = category1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.categoryWithJoinColumn = category2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoryWithJoinColumn", "category")
                .orderBy("post.id")
                .getMany();

            expect(loadedPosts[0].categoryWithJoinColumn).not.toBeUndefined();
            expect(loadedPosts[0].categoryWithJoinColumn.name).toEqual("cars");
            expect(loadedPosts[0].categoryWithJoinColumn.type).toEqual("common-category");
            expect(loadedPosts[1].categoryWithJoinColumn).not.toBeUndefined();
            expect(loadedPosts[1].categoryWithJoinColumn.name).toEqual("airplanes");
            expect(loadedPosts[1].categoryWithJoinColumn.type).toEqual("common-category");

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoryWithJoinColumn", "category")
                .where("post.id = :id", {id: 1})
                .getOne();

            expect(loadedPost!.categoryWithJoinColumn).not.toBeUndefined();
            expect(loadedPost!.categoryWithJoinColumn.name).toEqual("cars");
            expect(loadedPost!.categoryWithJoinColumn.type).toEqual("common-category");

        })));

        test("should load related entity when JoinColumn is specified with options", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            category2.type = "common-category";
            category2.code = 2;
            category2.version = 1;
            await connection.manager.save(category2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.categoryWithOptions = category1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.categoryWithOptions = category2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoryWithOptions", "category")
                .orderBy("post.id")
                .getMany();

            expect(loadedPosts[0].categoryWithOptions).not.toEqual([]);
            expect(loadedPosts[0].categoryWithOptions.name).toEqual("cars");
            expect(loadedPosts[0].categoryWithOptions.type).toEqual("common-category");
            expect(loadedPosts[1].categoryWithOptions).not.toEqual([]);
            expect(loadedPosts[1].categoryWithOptions.name).toEqual("airplanes");
            expect(loadedPosts[1].categoryWithOptions.type).toEqual("common-category");

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoryWithOptions", "category")
                .where("post.id = :id", {id: 1})
                .getOne();

            expect(loadedPost!.categoryWithOptions).not.toEqual([]);
            expect(loadedPost!.categoryWithOptions.name).toEqual("cars");
            expect(loadedPost!.categoryWithOptions.type).toEqual("common-category");

        })));

        test("should load related entity when JoinColumn references on to non-primary columns", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            category1.description = "category about cars";
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            category2.type = "common-category";
            category2.code = 2;
            category2.version = 1;
            category2.description = "category about airplanes";
            await connection.manager.save(category2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.categoryWithNonPKColumns = category1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.categoryWithNonPKColumns = category2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoryWithNonPKColumns", "category")
                .orderBy("post.id")
                .getMany();

            expect(loadedPosts[0].categoryWithNonPKColumns).not.toEqual([]);
            expect(loadedPosts[0].categoryWithNonPKColumns.code).toEqual(1);
            expect(loadedPosts[0].categoryWithNonPKColumns.version).toEqual(1);
            expect(loadedPosts[0].categoryWithNonPKColumns.description).toEqual("category about cars");
            expect(loadedPosts[1].categoryWithNonPKColumns).not.toEqual([]);
            expect(loadedPosts[1].categoryWithNonPKColumns.code).toEqual(2);
            expect(loadedPosts[1].categoryWithNonPKColumns.version).toEqual(1);

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoryWithNonPKColumns", "category")
                .where("post.id = :id", {id: 1})
                .getOne();

            expect(loadedPost!.categoryWithNonPKColumns).not.toEqual([]);
            expect(loadedPost!.categoryWithNonPKColumns.code).toEqual(1);
            expect(loadedPost!.categoryWithNonPKColumns.version).toEqual(1);
            expect(loadedPost!.categoryWithNonPKColumns.description).toEqual("category about cars");

        })));
    });

    describe("inverse side", () => {

        test("should load related entity when JoinColumn is not specified", () => Promise.all(connections.map(async connection => {

            const post1 = new Post();
            post1.title = "About BMW";
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Audi";
            await connection.manager.save(post2);

            const post3 = new Post();
            post3.title = "About Boeing";
            await connection.manager.save(post3);

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            category1.posts = [post1, post2];
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            category2.type = "common-category";
            category2.code = 2;
            category2.version = 1;
            category2.posts = [post3];
            await connection.manager.save(category2);

            const loadedCategories = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.posts", "posts")
                .orderBy("category.code, posts.id")
                .getMany();

            expect(loadedCategories[0].posts).not.toEqual([]);
            expect(loadedCategories[0].posts[0].id).toEqual(1);
            expect(loadedCategories[0].posts[0].title).toEqual("About BMW");
            expect(loadedCategories[0].posts[1].id).toEqual(2);
            expect(loadedCategories[0].posts[1].title).toEqual("About Audi");
            expect(loadedCategories[1].posts).not.toEqual([]);
            expect(loadedCategories[1].posts[0].id).toEqual(3);
            expect(loadedCategories[1].posts[0].title).toEqual("About Boeing");

            const loadedCategory = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.posts", "posts")
                .orderBy("posts.id")
                .where("category.code = :code", {code: 1})
                .getOne();

            expect(loadedCategory!.posts).not.toEqual([]);
            expect(loadedCategory!.posts[0].id).toEqual(1);
            expect(loadedCategory!.posts[0].title).toEqual("About BMW");
            expect(loadedCategory!.posts[1].id).toEqual(2);
            expect(loadedCategory!.posts[1].title).toEqual("About Audi");

        })));

        test("should load related entity when JoinColumn is specified without options", () => Promise.all(connections.map(async connection => {

            const post1 = new Post();
            post1.title = "About BMW";
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Audi";
            await connection.manager.save(post2);

            const post3 = new Post();
            post3.title = "About Boeing";
            await connection.manager.save(post3);

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            category1.postsWithJoinColumn = [post1, post2];
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            category2.type = "common-category";
            category2.code = 2;
            category2.version = 1;
            category2.postsWithJoinColumn = [post3];
            await connection.manager.save(category2);

            const loadedCategories = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.postsWithJoinColumn", "posts")
                .orderBy("category.code, posts.id")
                .getMany();

            expect(loadedCategories[0].postsWithJoinColumn).not.toBeUndefined();
            expect(loadedCategories[0].postsWithJoinColumn[0].id).toEqual(1);
            expect(loadedCategories[0].postsWithJoinColumn[0].title).toEqual("About BMW");
            expect(loadedCategories[0].postsWithJoinColumn[1].id).toEqual(2);
            expect(loadedCategories[0].postsWithJoinColumn[1].title).toEqual("About Audi");
            expect(loadedCategories[1].postsWithJoinColumn).not.toBeUndefined();
            expect(loadedCategories[1].postsWithJoinColumn[0].id).toEqual(3);
            expect(loadedCategories[1].postsWithJoinColumn[0].title).toEqual("About Boeing");

            const loadedCategory = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.postsWithJoinColumn", "posts")
                .orderBy("posts.id")
                .where("category.code = :code", {code: 1})
                .getOne();

            expect(loadedCategory!.postsWithJoinColumn).not.toBeUndefined();
            expect(loadedCategory!.postsWithJoinColumn[0].id).toEqual(1);
            expect(loadedCategory!.postsWithJoinColumn[0].title).toEqual("About BMW");
            expect(loadedCategory!.postsWithJoinColumn[1].id).toEqual(2);
            expect(loadedCategory!.postsWithJoinColumn[1].title).toEqual("About Audi");

        })));

        test("should load related entity when JoinColumn is specified with options", () => Promise.all(connections.map(async connection => {

            const post1 = new Post();
            post1.title = "About BMW";
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Audi";
            await connection.manager.save(post2);

            const post3 = new Post();
            post3.title = "About Boeing";
            await connection.manager.save(post3);

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            category1.postsWithOptions = [post1, post2];
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            category2.type = "common-category";
            category2.code = 2;
            category2.version = 1;
            category2.postsWithOptions = [post3];
            await connection.manager.save(category2);

            const loadedCategories = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.postsWithOptions", "posts")
                .orderBy("category.code, posts.id")
                .getMany();

            expect(loadedCategories[0].postsWithOptions).not.toEqual([]);
            expect(loadedCategories[0].postsWithOptions[0].id).toEqual(1);
            expect(loadedCategories[0].postsWithOptions[0].title).toEqual("About BMW");
            expect(loadedCategories[0].postsWithOptions[1].id).toEqual(2);
            expect(loadedCategories[0].postsWithOptions[1].title).toEqual("About Audi");
            expect(loadedCategories[1].postsWithOptions).not.toEqual([]);
            expect(loadedCategories[1].postsWithOptions[0].id).toEqual(3);
            expect(loadedCategories[1].postsWithOptions[0].title).toEqual("About Boeing");

            const loadedCategory = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.postsWithOptions", "posts")
                .orderBy("posts.id")
                .where("category.code = :code", {code: 1})
                .getOne();

            expect(loadedCategory!.postsWithOptions).not.toEqual([]);
            expect(loadedCategory!.postsWithOptions[0].id).toEqual(1);
            expect(loadedCategory!.postsWithOptions[0].title).toEqual("About BMW");
            expect(loadedCategory!.postsWithOptions[1].id).toEqual(2);
            expect(loadedCategory!.postsWithOptions[1].title).toEqual("About Audi");

        })));

        test("should load related entity when JoinColumn references on to non-primary columns", () => Promise.all(connections.map(async connection => {

            const post1 = new Post();
            post1.title = "About BMW";
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Audi";
            await connection.manager.save(post2);

            const post3 = new Post();
            post3.title = "About Boeing";
            await connection.manager.save(post3);

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            category1.description = "category of cars";
            category1.postsWithNonPKColumns = [post1, post2];
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            category2.type = "common-category";
            category2.code = 2;
            category2.version = 1;
            category2.description = "category of airplanes";
            category2.postsWithNonPKColumns = [post3];
            await connection.manager.save(category2);

            const loadedCategories = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.postsWithNonPKColumns", "posts")
                .orderBy("category.code, posts.id")
                .getMany();

            expect(loadedCategories[0].postsWithNonPKColumns).not.toEqual([]);
            expect(loadedCategories[0].postsWithNonPKColumns[0].id).toEqual(1);
            expect(loadedCategories[0].postsWithNonPKColumns[0].title).toEqual("About BMW");
            expect(loadedCategories[0].postsWithNonPKColumns[1].id).toEqual(2);
            expect(loadedCategories[0].postsWithNonPKColumns[1].title).toEqual("About Audi");
            expect(loadedCategories[1].postsWithNonPKColumns).not.toEqual([]);
            expect(loadedCategories[1].postsWithNonPKColumns[0].id).toEqual(3);
            expect(loadedCategories[1].postsWithNonPKColumns[0].title).toEqual("About Boeing");

            const loadedCategory = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.postsWithNonPKColumns", "posts")
                .orderBy("posts.id")
                .where("category.code = :code", {code: 1})
                .getOne();

            expect(loadedCategory!.postsWithNonPKColumns).not.toEqual([]);
            expect(loadedCategory!.postsWithNonPKColumns[0].id).toEqual(1);
            expect(loadedCategory!.postsWithNonPKColumns[0].title).toEqual("About BMW");
            expect(loadedCategory!.postsWithNonPKColumns[1].id).toEqual(2);
            expect(loadedCategory!.postsWithNonPKColumns[1].title).toEqual("About Audi");

        })));

    });

});
