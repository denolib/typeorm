import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src";
import {Category} from "./entity/Category";
import {Post} from "./entity/Post";

describe("decorators > relation-id > one-to-one", () => {
    
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should load ids when loadRelationIdAndMap used on owner side", () => Promise.all(connections.map(async connection => {

        const category1 = new Category();
        category1.id = 1;
        category1.name = "cars";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.id = 2;
        category2.name = "airplanes";
        await connection.manager.save(category2);

        const categoryByName1 = new Category();
        categoryByName1.id = 3;
        categoryByName1.name = "BMW";
        await connection.manager.save(categoryByName1);

        const categoryByName2 = new Category();
        categoryByName2.id = 4;
        categoryByName2.name = "Boeing";
        await connection.manager.save(categoryByName2);

        const post1 = new Post();
        post1.id = 1;
        post1.title = "about BMW";
        post1.category = category1;
        post1.categoryByName = categoryByName1;
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.id = 2;
        post2.title = "about Boeing";
        post2.category = category2;
        post2.categoryByName = categoryByName2;
        await connection.manager.save(post2);

        let loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .addOrderBy("post.id")
            .getMany();

        expect(loadedPosts![0].categoryId).not.toBeUndefined();
        expect(loadedPosts![0].categoryId).toEqual(1);
        expect(loadedPosts![0].categoryName).not.toBeUndefined();
        expect(loadedPosts![0].categoryName).toEqual("BMW");
        expect(loadedPosts![1].categoryId).not.toBeUndefined();
        expect(loadedPosts![1].categoryId).toEqual(2);
        expect(loadedPosts![1].categoryName).not.toBeUndefined();
        expect(loadedPosts![1].categoryName).toEqual("Boeing");

        let loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost!.categoryId).not.toBeUndefined();
        expect(loadedPost!.categoryId).toEqual(1);
        expect(loadedPost!.categoryName).not.toBeUndefined();
        expect(loadedPost!.categoryName).toEqual("BMW");
    })));

    test("should load id when loadRelationIdAndMap used on inverse side", () => Promise.all(connections.map(async connection => {

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
        post1.title = "about BMW";
        post1.category2 = category1;
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.id = 2;
        post2.title = "about Boeing";
        post2.category2 = category2;
        await connection.manager.save(post2);

        let loadedCategories = await connection.manager
            .createQueryBuilder(Category, "category")
            .addOrderBy("category.id")
            .getMany();

        expect(loadedCategories![0].postId).not.toBeUndefined();
        expect(loadedCategories![0].postId).toEqual(1);
        expect(loadedCategories![1].postId).not.toBeUndefined();
        expect(loadedCategories![1].postId).toEqual(2);

        let loadedCategory = await connection.manager
            .createQueryBuilder(Category, "category")
            .where("category.id = :id", { id: 1 })
            .getOne();

        expect(loadedCategory!.postId).not.toBeUndefined();
        expect(loadedCategory!.postId).toEqual(1);
    })));

});
