import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {Image} from "./entity/Image";

describe("decorators > relation-id-decorator > many-to-many", () => {
    
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should load ids when RelationId decorator used on owner side", () => Promise.all(connections.map(async connection => {

        const category1 = new Category();
        category1.id = 1;
        category1.name = "kids";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.id = 2;
        category2.name = "future";
        await connection.manager.save(category2);

        const category3 = new Category();
        category3.id = 3;
        category3.name = "cars";
        await connection.manager.save(category3);

        const post = new Post();
        post.id = 1;
        post.title = "about kids";
        post.categories = [category1, category2];
        await connection.manager.save(post);

        const post2 = new Post();
        post2.id = 2;
        post2.title = "about BMW";
        post2.categories = [category3];
        await connection.manager.save(post2);

        let loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .orderBy("post.id")
            .getMany();

        expect(loadedPosts![0].categoryIds).not.toEqual([]);
        expect(loadedPosts![0].categoryIds[0]).toEqual(1);
        expect(loadedPosts![0].categoryIds[1]).toEqual(2);
        expect(loadedPosts![1].categoryIds).not.toEqual([]);
        expect(loadedPosts![1].categoryIds[0]).toEqual(3);

        let loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost!.categoryIds).not.toEqual([]);
        expect(loadedPost!.categoryIds[0]).toEqual(1);
        expect(loadedPost!.categoryIds[1]).toEqual(2);

    })));

    test("should load ids when RelationId decorator used on owner side with additional condition", () => Promise.all(connections.map(async connection => {

        const category1 = new Category();
        category1.id = 1;
        category1.name = "kids";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.id = 2;
        category2.name = "future";
        category2.isRemoved = true;
        await connection.manager.save(category2);

        const category3 = new Category();
        category3.id = 3;
        category3.name = "cars";
        category3.isRemoved = true;
        await connection.manager.save(category3);

        const post = new Post();
        post.id = 1;
        post.title = "about kids";
        post.categories = [category1, category2];
        await connection.manager.save(post);

        const post2 = new Post();
        post2.id = 2;
        post2.title = "about BMW";
        post2.categories = [category3];
        await connection.manager.save(post2);

        let loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .orderBy("post.id")
            .getMany();

        expect(loadedPosts![0].removedCategoryIds).not.toEqual([]);
        expect(loadedPosts![0].removedCategoryIds.length).toEqual(1);
        expect(loadedPosts![0].removedCategoryIds[0]).toEqual(2);
        expect(loadedPosts![1].removedCategoryIds).not.toEqual([]);
        expect(loadedPosts![1].removedCategoryIds[0]).toEqual(3);

        let loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost!.removedCategoryIds).not.toEqual([]);
        expect(loadedPost!.removedCategoryIds.length).toEqual(1);
        expect(loadedPost!.removedCategoryIds[0]).toEqual(2);

    })));

    test("should load ids when RelationId decorator used on owner side without inverse side", () => Promise.all(connections.map(async connection => {

        const category1 = new Category();
        category1.id = 1;
        category1.name = "kids";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.id = 2;
        category2.name = "future";
        await connection.manager.save(category2);

        const post = new Post();
        post.id = 1;
        post.title = "about kids";
        post.subcategories = [category1, category2];
        await connection.manager.save(post);

        let loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost!.subcategoryIds).not.toEqual([]);
        expect(loadedPost!.subcategoryIds[0]).toEqual(1);
        expect(loadedPost!.subcategoryIds[1]).toEqual(2);

    })));

    test("should load ids when RelationId decorator used on owner side without inverse side and with additional condition", () => Promise.all(connections.map(async connection => {

        const category1 = new Category();
        category1.id = 1;
        category1.name = "kids";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.id = 2;
        category2.name = "future";
        category2.isRemoved = true;
        await connection.manager.save(category2);

        const post = new Post();
        post.id = 1;
        post.title = "about kids";
        post.subcategories = [category1, category2];
        await connection.manager.save(post);

        let loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost!.removedSubcategoryIds).not.toEqual([]);
        expect(loadedPost!.removedSubcategoryIds.length).toEqual(1);
        expect(loadedPost!.removedSubcategoryIds[0]).toEqual(2);

    })));

    test("should load ids when RelationId decorator used on inverse side", () => Promise.all(connections.map(async connection => {

        const category = new Category();
        category.id = 1;
        category.name = "cars";
        await connection.manager.save(category);

        const post1 = new Post();
        post1.id = 1;
        post1.title = "about BMW";
        post1.categories = [category];
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.id = 2;
        post2.title = "about Audi";
        post2.categories = [category];
        await connection.manager.save(post2);

        let loadedCategory = await connection.manager
            .createQueryBuilder(Category, "category")
            .where("category.id = :id", { id: 1 })
            .getOne();

        expect(loadedCategory!.postIds).not.toEqual([]);
        expect(loadedCategory!.postIds[0]).toEqual(1);
        expect(loadedCategory!.postIds[1]).toEqual(2);

    })));

    test("should load ids when RelationId decorator used on inverse side with additional condition", () => Promise.all(connections.map(async connection => {

        const category = new Category();
        category.id = 1;
        category.name = "cars";
        await connection.manager.save(category);

        const post1 = new Post();
        post1.id = 1;
        post1.title = "about BMW";
        post1.categories = [category];
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.id = 2;
        post2.title = "about Audi";
        post2.isRemoved = true;
        post2.categories = [category];
        await connection.manager.save(post2);

        let loadedCategory = await connection.manager
            .createQueryBuilder(Category, "category")
            .where("category.id = :id", { id: 1 })
            .getOne();

        expect(loadedCategory!.removedPostIds).not.toEqual([]);
        expect(loadedCategory!.removedPostIds.length).toEqual(1);
        expect(loadedCategory!.removedPostIds[0]).toEqual(2);

    })));

    test("should load ids when RelationId decorator used on nested relation", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.id = 1;
        image1.name = "photo1";
        await connection.manager.save(image1);

        const image2 = new Image();
        image2.id = 2;
        image2.name = "photo2";
        await connection.manager.save(image2);

        const image3 = new Image();
        image3.id = 3;
        image3.name = "photo2";
        await connection.manager.save(image3);

        const category1 = new Category();
        category1.id = 1;
        category1.name = "cars";
        category1.images = [image1, image2];
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.id = 2;
        category2.name = "BMW";
        await connection.manager.save(category2);

        const category3 = new Category();
        category3.id = 3;
        category3.name = "Audi";
        category3.images = [image3];
        await connection.manager.save(category3);

        const post = new Post();
        post.id = 1;
        post.title = "about BMW";
        post.categories = [category1, category2];
        await connection.manager.save(post);

        const post2 = new Post();
        post2.id = 2;
        post2.title = "about Audi";
        post2.categories = [category3];
        await connection.manager.save(post2);

        let loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .addOrderBy("post.id, categories.id")
            .getMany();

        expect(loadedPosts![0].categories).not.toEqual([]);
        expect(loadedPosts![0].categoryIds).not.toEqual([]);
        expect(loadedPosts![0].categoryIds.length).toEqual(2);
        expect(loadedPosts![0].categoryIds[0]).toEqual(1);
        expect(loadedPosts![0].categoryIds[1]).toEqual(2);
        expect(loadedPosts![0].categories[0].imageIds).not.toEqual([]);
        expect(loadedPosts![0].categories[0].imageIds.length).toEqual(2);
        expect(loadedPosts![0].categories[0].imageIds[0]).toEqual(1);
        expect(loadedPosts![0].categories[0].imageIds[1]).toEqual(2);
        expect(loadedPosts![1].categories).not.toEqual([]);
        expect(loadedPosts![1].categoryIds).not.toEqual([]);
        expect(loadedPosts![1].categoryIds.length).toEqual(1);
        expect(loadedPosts![1].categoryIds[0]).toEqual(3);
        expect(loadedPosts![1].categories[0].imageIds).not.toEqual([]);
        expect(loadedPosts![1].categories[0].imageIds.length).toEqual(1);
        expect(loadedPosts![1].categories[0].imageIds[0]).toEqual(3);

        let loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .addOrderBy("post.id, categories.id")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost!.categories).not.toEqual([]);
        expect(loadedPost!.categoryIds).not.toEqual([]);
        expect(loadedPost!.categoryIds.length).toEqual(2);
        expect(loadedPost!.categoryIds[0]).toEqual(1);
        expect(loadedPost!.categoryIds[1]).toEqual(2);
        expect(loadedPost!.categories[0].imageIds).not.toEqual([]);
        expect(loadedPost!.categories[0].imageIds.length).toEqual(2);
        expect(loadedPost!.categories[0].imageIds[0]).toEqual(1);
        expect(loadedPost!.categories[0].imageIds[1]).toEqual(2);

    })));

    test("should not load ids of nested relations when RelationId decorator used on inherit relation and parent relation was not found", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.id = 1;
        image1.name = "photo1";
        await connection.manager.save(image1);

        const image2 = new Image();
        image2.id = 2;
        image2.name = "photo2";
        await connection.manager.save(image2);

        const category1 = new Category();
        category1.id = 1;
        category1.name = "cars";
        category1.images = [image1, image2];
        await connection.manager.save(category1);

        const post = new Post();
        post.id = 1;
        post.title = "about BMW";
        post.categories = [category1];
        await connection.manager.save(post);

        let loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories", "categories.id = :categoryCode")
            .where("post.id = :id", { id: 1 })
            .setParameter("categoryCode", 2)
            .addOrderBy("post.id, categories.id")
            .getOne();

        expect(loadedPost!.categories).toEqual([]);

    })));

    test("should load ids when RelationId decorator used on nested relation with additional conditions", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.id = 1;
        image1.name = "photo1";
        await connection.manager.save(image1);

        const image2 = new Image();
        image2.id = 2;
        image2.name = "photo2";
        image2.isRemoved = true;
        await connection.manager.save(image2);

        const image3 = new Image();
        image3.id = 3;
        image3.name = "photo2";
        image3.isRemoved = true;
        await connection.manager.save(image3);

        const category1 = new Category();
        category1.id = 1;
        category1.name = "cars";
        category1.images = [image1, image2];
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.id = 2;
        category2.name = "BMW";
        category2.isRemoved = true;
        await connection.manager.save(category2);

        const category3 = new Category();
        category3.id = 3;
        category3.name = "BMW";
        category3.isRemoved = true;
        category3.images = [image3];
        await connection.manager.save(category3);

        const post = new Post();
        post.id = 1;
        post.title = "about BMW";
        post.categories = [category1, category2];
        await connection.manager.save(post);

        const post2 = new Post();
        post2.id = 2;
        post2.title = "about BMW";
        post2.categories = [category3];
        await connection.manager.save(post2);

        let loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .addOrderBy("post.id, categories.id")
            .getMany();

        expect(loadedPosts![0].categories).not.toEqual([]);
        expect(loadedPosts![0].categoryIds).not.toEqual([]);
        expect(loadedPosts![0].removedCategoryIds.length).toEqual(1);
        expect(loadedPosts![0].removedCategoryIds[0]).toEqual(2);
        expect(loadedPosts![0].categories[0].removedImageIds).not.toEqual([]);
        expect(loadedPosts![0].categories[0].removedImageIds.length).toEqual(1);
        expect(loadedPosts![0].categories[0].removedImageIds[0]).toEqual(2);
        expect(loadedPosts![1].categories).not.toEqual([]);
        expect(loadedPosts![1].categoryIds).not.toEqual([]);
        expect(loadedPosts![1].removedCategoryIds.length).toEqual(1);
        expect(loadedPosts![1].removedCategoryIds[0]).toEqual(3);
        expect(loadedPosts![1].categories[0].removedImageIds).not.toEqual([]);
        expect(loadedPosts![1].categories[0].removedImageIds.length).toEqual(1);
        expect(loadedPosts![1].categories[0].removedImageIds[0]).toEqual(3);

        let loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .addOrderBy("post.id, categories.id")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost!.categories).not.toEqual([]);
        expect(loadedPost!.categoryIds).not.toEqual([]);
        expect(loadedPost!.removedCategoryIds.length).toEqual(1);
        expect(loadedPost!.removedCategoryIds[0]).toEqual(2);
        expect(loadedPost!.categories[0].removedImageIds).not.toEqual([]);
        expect(loadedPost!.categories[0].removedImageIds.length).toEqual(1);
        expect(loadedPost!.categories[0].removedImageIds[0]).toEqual(2);

    })));

});
