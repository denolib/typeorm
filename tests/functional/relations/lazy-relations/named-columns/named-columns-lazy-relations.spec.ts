import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src";
import {
    Post,
} from "./entity/Post";
import {
    Category,
} from "./entity/Category";

/**
 * Because lazy relations are overriding prototype is impossible to run these tests on multiple connections.
 * So we run tests only for mysql.
 */
describe("named-columns-lazy-relations", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [
            Post,
            Category,
        ],
        enabledDrivers: ["postgres"] // we can properly test lazy-relations only on one platform
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should persist and hydrate successfully on a relation without inverse side", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);

        const savedCategory1 = new Category();
        savedCategory1.name = "kids";
        const savedCategory2 = new Category();
        savedCategory2.name = "people";
        const savedCategory3 = new Category();
        savedCategory3.name = "animals";

        await categoryRepository.save(savedCategory1);
        await categoryRepository.save(savedCategory2);
        await categoryRepository.save(savedCategory3);

        const savedPost = new Post();
        savedPost.title = "Hello post";
        savedPost.text = "This is post about post";
        savedPost.categories = Promise.resolve([
            savedCategory1, savedCategory2, savedCategory3
        ]);

        await postRepository.save(savedPost);

        expect(await savedPost.categories).toEqual([savedCategory1, savedCategory2, savedCategory3]);

        const post = (await postRepository.findOne(1))!;
        expect(post.title).toEqual("Hello post");
        expect(post.text).toEqual("This is post about post");

        const categories = await post.categories;
        expect(categories.length).toEqual(3);
        expect(categories).toEqual([savedCategory1, savedCategory2, savedCategory3]);

        expect(categories).toContainEqual(savedCategory1);
        expect(categories).toContainEqual(savedCategory2);
        expect(categories).toContainEqual(savedCategory3);
    })));


    test("should persist and hydrate successfully on a relation with inverse side", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);

        const savedCategory1 = new Category();
        savedCategory1.name = "kids";
        const savedCategory2 = new Category();
        savedCategory2.name = "people";
        const savedCategory3 = new Category();
        savedCategory3.name = "animals";

        await categoryRepository.save(savedCategory1);
        await categoryRepository.save(savedCategory2);
        await categoryRepository.save(savedCategory3);

        const savedPost = new Post();
        savedPost.title = "Hello post";
        savedPost.text = "This is post about post";
        savedPost.twoSideCategories = Promise.resolve([
            savedCategory1, savedCategory2, savedCategory3
        ]);

        await postRepository.save(savedPost);

        expect(await savedPost.twoSideCategories).toEqual([savedCategory1, savedCategory2, savedCategory3]);

        const post = (await postRepository.findOne(1))!;
        expect(post.title).toEqual("Hello post");
        expect(post.text).toEqual("This is post about post");

        const categories = await post.twoSideCategories;
        expect(categories.length).toEqual(3);

        expect(categories).toContainEqual(savedCategory1);
        expect(categories).toContainEqual(savedCategory2);
        expect(categories).toContainEqual(savedCategory3);

        const category = (await categoryRepository.findOne(1))!;
        expect(category.name).toEqual("kids");

        const twoSidePosts = await category.twoSidePosts;

        const likePost = new Post();
        likePost.id = 1;
        likePost.title = "Hello post";
        likePost.text = "This is post about post";
        expect(twoSidePosts).toContainEqual(likePost);
    })));

    test("should persist and hydrate successfully on a many-to-one relation without inverse side", () => Promise.all(connections.map(async connection => {

        // create some fake posts and categories to make sure that there are several post ids in the db
        const fakePosts: Post[] = [];
        for (let i = 0; i < 30; i++) {
            const fakePost = new Post();
            fakePost.title = "post #" + i;
            fakePost.text = "post #" + i;
            fakePosts.push(fakePost);
        }
        await connection.manager.save(fakePosts);

        const fakeCategories: Category[] = [];
        for (let i = 0; i < 8; i++) {
            const fakeCategory = new Category();
            fakeCategory.name = "category #" + i;
            fakeCategories.push(fakeCategory);
        }
        await connection.manager.save(fakeCategories);

        const category = new Category();
        category.name = "category of great post";

        const post = new Post();
        post.title = "post with great category";
        post.text = "post with great category and great text";
        post.category = Promise.resolve(category);

        await connection.manager.save(category);
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post, { where: { title: "post with great category" } });
        const loadedCategory = await loadedPost!.category;

        expect(loadedCategory.name).toEqual("category of great post");
    })));

    test("should persist and hydrate successfully on a many-to-one relation with inverse side", () => Promise.all(connections.map(async connection => {

        // create some fake posts and categories to make sure that there are several post ids in the db
        const fakePosts: Post[] = [];
        for (let i = 0; i < 8; i++) {
            const fakePost = new Post();
            fakePost.title = "post #" + i;
            fakePost.text = "post #" + i;
            fakePosts.push(fakePost);
        }
        await connection.manager.save(fakePosts);

        const fakeCategories: Category[] = [];
        for (let i = 0; i < 30; i++) {
            const fakeCategory = new Category();
            fakeCategory.name = "category #" + i;
            fakeCategories.push(fakeCategory);
        }
        await connection.manager.save(fakeCategories);

        const category = new Category();
        category.name = "category of great post";

        const post = new Post();
        post.title = "post with great category";
        post.text = "post with great category and great text";
        post.twoSideCategory = Promise.resolve(category);

        await connection.manager.save(category);
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post, { where: { title: "post with great category" } });
        const loadedCategory = await loadedPost!.twoSideCategory;

        expect(loadedCategory.name).toEqual("category of great post");
    })));

    test("should persist and hydrate successfully on a one-to-many relation", () => Promise.all(connections.map(async connection => {

        // create some fake posts and categories to make sure that there are several post ids in the db
        const fakePosts: Post[] = [];
        for (let i = 0; i < 8; i++) {
            const fakePost = new Post();
            fakePost.title = "post #" + i;
            fakePost.text = "post #" + i;
            fakePosts.push(fakePost);
        }
        await connection.manager.save(fakePosts);

        const fakeCategories: Category[] = [];
        for (let i = 0; i < 30; i++) {
            const fakeCategory = new Category();
            fakeCategory.name = "category #" + i;
            fakeCategories.push(fakeCategory);
        }
        await connection.manager.save(fakeCategories);

        const category = new Category();
        category.name = "category of great post";
        await connection.manager.save(category);

        const post = new Post();
        post.title = "post with great category";
        post.text = "post with great category and great text";
        post.twoSideCategory = Promise.resolve(category);
        await connection.manager.save(post);

        const loadedCategory = await connection.manager.findOne(Category, { where: { name: "category of great post" } });
        const loadedPost = await loadedCategory!.twoSidePosts2;

        expect(loadedPost[0].title).toEqual("post with great category");
    })));

    test("should persist and hydrate successfully on a one-to-one relation owner side", () => Promise.all(connections.map(async connection => {

        // create some fake posts and categories to make sure that there are several post ids in the db
        const fakePosts: Post[] = [];
        for (let i = 0; i < 8; i++) {
            const fakePost = new Post();
            fakePost.title = "post #" + i;
            fakePost.text = "post #" + i;
            fakePosts.push(fakePost);
        }
        await connection.manager.save(fakePosts);

        const fakeCategories: Category[] = [];
        for (let i = 0; i < 30; i++) {
            const fakeCategory = new Category();
            fakeCategory.name = "category #" + i;
            fakeCategories.push(fakeCategory);
        }
        await connection.manager.save(fakeCategories);

        const category = new Category();
        category.name = "category of great post";
        await connection.manager.save(category);

        const post = new Post();
        post.title = "post with great category";
        post.text = "post with great category and great text";
        post.oneCategory = Promise.resolve(category);
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post, { where: { title: "post with great category" } });
        const loadedCategory = await loadedPost!.oneCategory;

        expect(loadedCategory.name).toEqual("category of great post");
    })));

    test("should persist and hydrate successfully on a one-to-one relation inverse side", () => Promise.all(connections.map(async connection => {

        // create some fake posts and categories to make sure that there are several post ids in the db
        const fakePosts: Post[] = [];
        for (let i = 0; i < 8; i++) {
            const fakePost = new Post();
            fakePost.title = "post #" + i;
            fakePost.text = "post #" + i;
            fakePosts.push(fakePost);
        }
        await connection.manager.save(fakePosts);

        const fakeCategories: Category[] = [];
        for (let i = 0; i < 30; i++) {
            const fakeCategory = new Category();
            fakeCategory.name = "category #" + i;
            fakeCategories.push(fakeCategory);
        }
        await connection.manager.save(fakeCategories);

        const category = new Category();
        category.name = "category of great post";
        await connection.manager.save(category);

        const post = new Post();
        post.title = "post with great category";
        post.text = "post with great category and great text";
        post.oneCategory = Promise.resolve(category);
        await connection.manager.save(post);

        const loadedCategory = await connection.manager.findOne(Category, { where: { name: "category of great post" } });
        const loadedPost = await loadedCategory!.onePost;
        expect(loadedPost.title).toEqual("post with great category");
    })));

});
