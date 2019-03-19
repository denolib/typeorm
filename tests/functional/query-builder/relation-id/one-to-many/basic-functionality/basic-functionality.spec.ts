import "reflect-metadata";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../utils/test-utils";
import {Connection} from "../../../../../../src";
import {Category} from "./entity/Category";
import {Post} from "./entity/Post";
import {Image} from "./entity/Image";

describe("query builder > relation-id > one-to-many > basic-functionality", () => {
    
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should load id when loadRelationIdAndMap used with OneToMany relation", () => Promise.all(connections.map(async connection => {

        const category1 = new Category();
        category1.name = "cars";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.name = "BMW";
        await connection.manager.save(category2);

        const category3 = new Category();
        category3.name = "airplanes";
        await connection.manager.save(category3);

        const category4 = new Category();
        category4.name = "Boeing";
        await connection.manager.save(category4);

        const post1 = new Post();
        post1.title = "about BMW";
        post1.categories = [category1, category2];
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "about Audi";
        post2.categories = [category3, category4];
        await connection.manager.save(post2);

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .loadRelationIdAndMap("post.categoryIds", "post.categories")
            .getMany();

        expect(loadedPosts[0].categoryIds).not.toEqual([]);
        expect(loadedPosts[0].categoryIds.length).toEqual(2);
        expect(loadedPosts[0].categoryIds[0]).toEqual(1);
        expect(loadedPosts[0].categoryIds[1]).toEqual(2);
        expect(loadedPosts[1].categoryIds).not.toEqual([]);
        expect(loadedPosts[1].categoryIds.length).toEqual(2);
        expect(loadedPosts[1].categoryIds[0]).toEqual(3);
        expect(loadedPosts[1].categoryIds[1]).toEqual(4);

        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .loadRelationIdAndMap("post.categoryIds", "post.categories")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost!.categoryIds).not.toEqual([]);
        expect(loadedPost!.categoryIds.length).toEqual(2);
        expect(loadedPost!.categoryIds[0]).toEqual(1);
        expect(loadedPost!.categoryIds[1]).toEqual(2);
    })));

    test("should load id when loadRelationIdAndMap used with additional condition", () => Promise.all(connections.map(async connection => {

        const category1 = new Category();
        category1.name = "cars";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.name = "BMW";
        category2.isRemoved = true;
        await connection.manager.save(category2);

        const category3 = new Category();
        category3.name = "airplanes";
        await connection.manager.save(category3);

        const category4 = new Category();
        category4.name = "Boeing";
        category4.isRemoved = true;
        await connection.manager.save(category4);

        const post1 = new Post();
        post1.title = "about BMW";
        post1.categories = [category1, category2];
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "about Audi";
        post2.categories = [category3, category4];
        await connection.manager.save(post2);

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .loadRelationIdAndMap("post.categoryIds", "post.categories", "category", qb => qb.andWhere("category.isRemoved = :isRemoved", { isRemoved: true }))
            .getMany();

        expect(loadedPosts[0].categoryIds).not.toEqual([]);
        expect(loadedPosts[0].categoryIds.length).toEqual(1);
        expect(loadedPosts[0].categoryIds[0]).toEqual(2);
        expect(loadedPosts[1].categoryIds).not.toEqual([]);
        expect(loadedPosts[1].categoryIds.length).toEqual(1);
        expect(loadedPosts[1].categoryIds[0]).toEqual(4);

        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .loadRelationIdAndMap("post.categoryIds", "post.categories", "category", qb => qb.andWhere("category.id = :categoryId", { categoryId: 1 }))
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost!.categoryIds).not.toEqual([]);
        expect(loadedPost!.categoryIds.length).toEqual(1);
        expect(loadedPost!.categoryIds[0]).toEqual(1);
    })));

    test("should load id when loadRelationIdAndMap used on nested relation", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.name = "Image #1";
        await connection.manager.save(image1);

        const image2 = new Image();
        image2.name = "Image #2";
        await connection.manager.save(image2);

        const image3 = new Image();
        image3.name = "Image #3";
        await connection.manager.save(image3);

        const image4 = new Image();
        image4.name = "Image #4";
        await connection.manager.save(image4);

        const image5 = new Image();
        image5.name = "Image #5";
        await connection.manager.save(image5);

        const category1 = new Category();
        category1.name = "cars";
        category1.images = [image1, image2];
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.name = "BMW";
        category2.images = [image3];
        await connection.manager.save(category2);

        const category3 = new Category();
        category3.name = "airplanes";
        category3.images = [image4, image5];
        await connection.manager.save(category3);

        const category4 = new Category();
        category4.name = "Boeing";
        await connection.manager.save(category4);

        const post1 = new Post();
        post1.title = "about BMW";
        post1.categories = [category1, category2];
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "about Audi";
        post2.categories = [category3, category4];
        await connection.manager.save(post2);

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .loadRelationIdAndMap("post.categoryIds", "post.categories")
            .leftJoinAndSelect("post.categories", "category")
            .loadRelationIdAndMap("category.imageIds", "category.images")
            .orderBy("category.id")
            .getMany();

        expect(loadedPosts[0].categoryIds).not.toEqual([]);
        expect(loadedPosts[0].categoryIds.length).toEqual(2);
        expect(loadedPosts[0].categoryIds[0]).toEqual(1);
        expect(loadedPosts[0].categoryIds[1]).toEqual(2);
        expect(loadedPosts[0].categories).not.toEqual([]);
        expect(loadedPosts[0].categories.length).toEqual(2);
        expect(loadedPosts[0].categories[0].imageIds).not.toEqual([]);
        expect(loadedPosts[0].categories[0].imageIds.length).toEqual(2);
        expect(loadedPosts[0].categories[0].imageIds[0]).toEqual(1);
        expect(loadedPosts[0].categories[0].imageIds[1]).toEqual(2);
        expect(loadedPosts[0].categories[1].imageIds).not.toEqual([]);
        expect(loadedPosts[0].categories[1].imageIds.length).toEqual(1);
        expect(loadedPosts[0].categories[1].imageIds[0]).toEqual(3);
        expect(loadedPosts[1].categoryIds).not.toEqual([]);
        expect(loadedPosts[1].categoryIds.length).toEqual(2);
        expect(loadedPosts[1].categoryIds[0]).toEqual(3);
        expect(loadedPosts[1].categoryIds[1]).toEqual(4);
        expect(loadedPosts[1].categories).not.toEqual([]);
        expect(loadedPosts[1].categories.length).toEqual(2);
        expect(loadedPosts[1].categories[0].imageIds).not.toEqual([]);
        expect(loadedPosts[1].categories[0].imageIds.length).toEqual(2);
        expect(loadedPosts[1].categories[0].imageIds[0]).toEqual(4);
        expect(loadedPosts[1].categories[0].imageIds[1]).toEqual(5);
        expect(loadedPosts[1].categories[1].imageIds).toEqual([]);

        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .loadRelationIdAndMap("post.categoryIds", "post.categories")
            .leftJoinAndSelect("post.categories", "category")
            .loadRelationIdAndMap("category.imageIds", "category.images")
            .where("post.id = :id", { id: 1 })
            .orderBy("category.id")
            .getOne();

        expect(loadedPost!.categoryIds).not.toEqual([]);
        expect(loadedPost!.categoryIds.length).toEqual(2);
        expect(loadedPost!.categoryIds[0]).toEqual(1);
        expect(loadedPost!.categoryIds[1]).toEqual(2);
        expect(loadedPost!.categories).not.toEqual([]);
        expect(loadedPost!.categories.length).toEqual(2);
        expect(loadedPost!.categories[0].imageIds).not.toEqual([]);
        expect(loadedPost!.categories[0].imageIds.length).toEqual(2);
        expect(loadedPost!.categories[0].imageIds[0]).toEqual(1);
        expect(loadedPost!.categories[0].imageIds[1]).toEqual(2);
        expect(loadedPost!.categories[1].imageIds).not.toEqual([]);
        expect(loadedPost!.categories[1].imageIds.length).toEqual(1);
        expect(loadedPost!.categories[1].imageIds[0]).toEqual(3);
    })));

});
