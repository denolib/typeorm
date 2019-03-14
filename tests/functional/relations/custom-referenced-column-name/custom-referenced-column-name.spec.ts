import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {Tag} from "./entity/Tag";

describe("relations > custom-referenced-column-name", () => {
    
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    describe("many-to-one", () => {

        test("should load related entity when relation use custom referenced column name", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
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
                .getMany();

            expect(loadedPosts![0].categoryName).not.toBeUndefined();
            expect(loadedPosts![0].categoryName).toEqual("cars");
            expect(loadedPosts![1].categoryName).not.toBeUndefined();
            expect(loadedPosts![1].categoryName).toEqual("airplanes");

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.categoryName).not.toBeUndefined();
            expect(loadedPost!.categoryName).toEqual("cars");

        })));

        test("should load related entity when relation defined with empty join column", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            await connection.manager.save(category2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.categoryWithEmptyJoinCol = category1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.categoryWithEmptyJoinCol = category2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoryWithEmptyJoinCol", "categoryWithEmptyJoinCol")
                .getMany();

            expect(loadedPosts![0].categoryWithEmptyJoinCol.id).toEqual(1);
            expect(loadedPosts![1].categoryWithEmptyJoinCol.id).toEqual(2);

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .where("post.id = :id", { id: 1 })
                .leftJoinAndSelect("post.categoryWithEmptyJoinCol", "categoryWithEmptyJoinCol")
                .getOne();

            expect(loadedPost!.categoryWithEmptyJoinCol.id).toEqual(1);

        })));

        test("should load related entity when relation defined without reference column name", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            await connection.manager.save(category2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.categoryWithoutRefColName = category1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.categoryWithoutRefColName = category2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .getMany();

            expect(loadedPosts![0].categoryId).toEqual(1);
            expect(loadedPosts![1].categoryId).toEqual(2);

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.categoryId).toEqual(1);

        })));

        test("should load related entity when relation defined without column name", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            await connection.manager.save(category2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.categoryWithoutColName = category1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.categoryWithoutColName = category2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoryWithoutColName", "categoryWithoutColName")
                .getMany();

            expect(loadedPosts![0].categoryWithoutColName.id).toEqual(1);
            expect(loadedPosts![1].categoryWithoutColName.id).toEqual(2);

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoryWithoutColName", "categoryWithoutColName")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.categoryWithoutColName.id).toEqual(1);

        })));

        test("should load related entity when relation defined without reference column name and relation does not have relation column in entity", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            await connection.manager.save(category2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.categoryWithoutRefColName2 = category1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.categoryWithoutRefColName2 = category2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoryWithoutRefColName2", "categoryWithoutRefColName2")
                .getMany();

            expect(loadedPosts![0].categoryWithoutRefColName2).not.toBeUndefined();
            expect(loadedPosts![0].categoryWithoutRefColName2.id).toEqual(1);
            expect(loadedPosts![1].categoryWithoutRefColName2).not.toBeUndefined();
            expect(loadedPosts![1].categoryWithoutRefColName2.id).toEqual(2);

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoryWithoutRefColName2", "categoryWithoutRefColName2")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.categoryWithoutRefColName2).not.toBeUndefined();
            expect(loadedPost!.categoryWithoutRefColName2.id).toEqual(1);

        })));

        test("should persist relation when relation sets via join column", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            await connection.manager.save(category2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.categoryName = "cars";
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.categoryName = "airplanes";
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.category", "category")
                .getMany();

            expect(loadedPosts![0].category).not.toBeUndefined();
            expect(loadedPosts![0].category.id).toEqual(1);
            expect(loadedPosts![1].category).not.toBeUndefined();
            expect(loadedPosts![1].category.id).toEqual(2);

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.category", "category")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.category).not.toBeUndefined();
            expect(loadedPost!.category.id).toEqual(1);

        })));
    });

    describe("one-to-one", () => {

        test("should load related entity when relation use custom referenced column name", () => Promise.all(connections.map(async connection => {

            const tag1 = new Tag();
            tag1.name = "tag #1";
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.name = "tag #2";
            await connection.manager.save(tag2);

            const post1 = new Post();
            post1.title = "Post #1";
            post1.tag = tag1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "Post #2";
            post2.tag = tag2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .getMany();

            expect(loadedPosts![0].tagName).not.toBeUndefined();
            expect(loadedPosts![0].tagName).toEqual("tag #1");
            expect(loadedPosts![1].tagName).not.toBeUndefined();
            expect(loadedPosts![1].tagName).toEqual("tag #2");

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.tagName).not.toBeUndefined();
            expect(loadedPost!.tagName).toEqual("tag #1");

        })));

        test("should load related entity when relation defined without column name", () => Promise.all(connections.map(async connection => {

            const tag1 = new Tag();
            tag1.name = "tag #1";
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.name = "tag #2";
            await connection.manager.save(tag2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.tagWithEmptyJoinCol = tag1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.tagWithEmptyJoinCol = tag2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.tagWithEmptyJoinCol", "tagWithEmptyJoinCol")
                .getMany();

            expect(loadedPosts![0].tagWithEmptyJoinCol.id).toEqual(1);
            expect(loadedPosts![1].tagWithEmptyJoinCol.id).toEqual(2);

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.tagWithEmptyJoinCol", "tagWithEmptyJoinCol")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.tagWithEmptyJoinCol.id).toEqual(1);

        })));

        test("should load related entity when relation defined without reference column name", () => Promise.all(connections.map(async connection => {

            const tag1 = new Tag();
            tag1.name = "tag #1";
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.name = "tag #2";
            await connection.manager.save(tag2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.tagWithoutRefColName = tag1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.tagWithoutRefColName = tag2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .getMany();

            expect(loadedPosts![0].tagId).toEqual(1);
            expect(loadedPosts![1].tagId).toEqual(2);

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.tagId).toEqual(1);

        })));

        test("should load related entity when relation defined without column name", () => Promise.all(connections.map(async connection => {

            const tag1 = new Tag();
            tag1.name = "tag #1";
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.name = "tag #2";
            await connection.manager.save(tag2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.tagWithoutColName = tag1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.tagWithoutColName = tag2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.tagWithoutColName", "tagWithoutColName")
                .getMany();

            expect(loadedPosts![0].tagWithoutColName.id).toEqual(1);
            expect(loadedPosts![1].tagWithoutColName.id).toEqual(2);

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.tagWithoutColName", "tagWithoutColName")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.tagWithoutColName.id).toEqual(1);

        })));

        test("should load related entity when relation defined without reference column name and relation does not have relation column in entity", () => Promise.all(connections.map(async connection => {

            const tag1 = new Tag();
            tag1.name = "tag #1";
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.name = "tag #2";
            await connection.manager.save(tag2);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.tagWithoutRefColName2 = tag1;
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.tagWithoutRefColName2 = tag2;
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.tagWithoutRefColName2", "tagWithoutRefColName2")
                .getMany();

            expect(loadedPosts![0].tagWithoutRefColName2).not.toBeUndefined();
            expect(loadedPosts![0].tagWithoutRefColName2.id).toEqual(1);
            expect(loadedPosts![1].tagWithoutRefColName2).not.toBeUndefined();
            expect(loadedPosts![1].tagWithoutRefColName2.id).toEqual(2);

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.tagWithoutRefColName2", "tagWithoutRefColName2")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.tagWithoutRefColName2).not.toBeUndefined();
            expect(loadedPost!.tagWithoutRefColName2.id).toEqual(1);

        })));

        test("should persist relation when relation sets via join column", () => Promise.all(connections.map(async connection => {

            const tag1 = new Tag();
            tag1.name = "tag #1";
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.name = "tag #2";
            await connection.manager.save(tag2);

            const post1 = new Post();
            post1.title = "Post #1";
            post1.tagName = "tag #1";
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "Post #2";
            post2.tagName = "tag #2";
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.tag", "tag")
                .getMany();

            expect(loadedPosts![0].tag).not.toBeUndefined();
            expect(loadedPosts![0].tag.id).toEqual(1);
            expect(loadedPosts![1].tag).not.toBeUndefined();
            expect(loadedPosts![1].tag.id).toEqual(2);

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.tag", "category")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.tag).not.toBeUndefined();
            expect(loadedPost!.tag.id).toEqual(1);

        })));
    });

});
