import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {Tag} from "./entity/Tag";

describe("relations > multiple-primary-keys > many-to-many", () => {
    
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    describe("owning side", () => {

        test("should load related entity when JoinTable used without options", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "BMW";
            category2.type = "cars-category";
            category2.code = 2;
            category2.version = 1;
            await connection.manager.save(category2);

            const category3 = new Category();
            category3.name = "airplanes";
            category3.type = "common-category";
            category3.code = 3;
            category3.version = 1;
            await connection.manager.save(category3);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.categories = [category1, category2];
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.categories = [category3];
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categories", "categories")
                .orderBy("post.id, categories.code")
                .getMany();

            expect(loadedPosts[0].categories).not.toEqual([]);
            expect(loadedPosts[0].categories[0].name).toEqual("cars");
            expect(loadedPosts[0].categories[0].type).toEqual("common-category");
            expect(loadedPosts[0].categories[1].name).toEqual("BMW");
            expect(loadedPosts[0].categories[1].type).toEqual("cars-category");
            expect(loadedPosts[1].categories).not.toEqual([]);
            expect(loadedPosts[1].categories[0].name).toEqual("airplanes");
            expect(loadedPosts[1].categories[0].type).toEqual("common-category");

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categories", "categories")
                .orderBy("categories.code")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.categories).not.toEqual([]);
            expect(loadedPost!.categories[0].name).toEqual("cars");
            expect(loadedPost!.categories[0].type).toEqual("common-category");

        })));

        test("should load related entity when JoinTable used with options", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "BMW";
            category2.type = "cars-category";
            category2.code = 2;
            category2.version = 1;
            await connection.manager.save(category2);

            const category3 = new Category();
            category3.name = "airplanes";
            category3.type = "common-category";
            category3.code = 3;
            category3.version = 1;
            await connection.manager.save(category3);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.categoriesWithOptions = [category1, category2];
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.categoriesWithOptions = [category3];
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoriesWithOptions", "categories")
                .orderBy("post.id, categories.code")
                .getMany();

            expect(loadedPosts[0].categoriesWithOptions).not.toEqual([]);
            expect(loadedPosts[0].categoriesWithOptions[0].name).toEqual("cars");
            expect(loadedPosts[0].categoriesWithOptions[0].type).toEqual("common-category");
            expect(loadedPosts[0].categoriesWithOptions[1].name).toEqual("BMW");
            expect(loadedPosts[0].categoriesWithOptions[1].type).toEqual("cars-category");
            expect(loadedPosts[1].categoriesWithOptions).not.toEqual([]);
            expect(loadedPosts[1].categoriesWithOptions[0].name).toEqual("airplanes");
            expect(loadedPosts[1].categoriesWithOptions[0].type).toEqual("common-category");

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoriesWithOptions", "categories")
                .orderBy("categories.code")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.categoriesWithOptions).not.toEqual([]);
            expect(loadedPost!.categoriesWithOptions[0].name).toEqual("cars");
            expect(loadedPost!.categoriesWithOptions[0].type).toEqual("common-category");

        })));

        test("should load related entity when JoinTable references with non-primary columns", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            category1.description = "category of cars";
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "BMW";
            category2.type = "cars-category";
            category2.code = 2;
            category2.version = 1;
            category2.description = "category of BMW";
            await connection.manager.save(category2);

            const category3 = new Category();
            category3.name = "airplanes";
            category3.type = "common-category";
            category3.code = 3;
            category3.version = 1;
            category3.description = "category of airplanes";
            await connection.manager.save(category3);

            const post1 = new Post();
            post1.title = "About BMW";
            post1.categoriesWithNonPKColumns = [category1, category2];
            await connection.manager.save(post1);

            const post2 = new Post();
            post2.title = "About Boeing";
            post2.categoriesWithNonPKColumns = [category3];
            await connection.manager.save(post2);

            const loadedPosts = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoriesWithNonPKColumns", "categories")
                .orderBy("post.id, categories.code")
                .getMany();

            expect(loadedPosts[0].categoriesWithNonPKColumns).not.toEqual([]);
            expect(loadedPosts[0].categoriesWithNonPKColumns[0].code).toEqual(1);
            expect(loadedPosts[0].categoriesWithNonPKColumns[0].version).toEqual(1);
            expect(loadedPosts[0].categoriesWithNonPKColumns[0].description).toEqual("category of cars");
            expect(loadedPosts[0].categoriesWithNonPKColumns[1].code).toEqual(2);
            expect(loadedPosts[0].categoriesWithNonPKColumns[1].version).toEqual(1);
            expect(loadedPosts[0].categoriesWithNonPKColumns[1].description).toEqual("category of BMW");
            expect(loadedPosts[1].categoriesWithNonPKColumns).not.toEqual([]);
            expect(loadedPosts[1].categoriesWithNonPKColumns[0].code).toEqual(3);
            expect(loadedPosts[1].categoriesWithNonPKColumns[0].version).toEqual(1);
            expect(loadedPosts[1].categoriesWithNonPKColumns[0].description).toEqual("category of airplanes");

            const loadedPost = await connection.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.categoriesWithNonPKColumns", "categories")
                .orderBy("categories.code")
                .where("post.id = :id", { id: 1 })
                .getOne();

            expect(loadedPost!.categoriesWithNonPKColumns).not.toEqual([]);
            expect(loadedPost!.categoriesWithNonPKColumns[0].code).toEqual(1);
            expect(loadedPost!.categoriesWithNonPKColumns[0].version).toEqual(1);
            expect(loadedPost!.categoriesWithNonPKColumns[0].description).toEqual("category of cars");

        })));

        test("should load related entity when both entities have multiple primary columns and JoinTable used without options", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "BMW";
            category2.type = "cars-category";
            category2.code = 2;
            category2.version = 1;
            await connection.manager.save(category2);

            const category3 = new Category();
            category3.name = "airplanes";
            category3.type = "common-category";
            category3.code = 3;
            category3.version = 1;
            await connection.manager.save(category3);

            const tag1 = new Tag();
            tag1.code = 1;
            tag1.title = "About BMW";
            tag1.description = "Tag about BMW";
            tag1.categories = [category1, category2];
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.code = 2;
            tag2.title = "About Boeing";
            tag2.description = "tag about Boeing";
            tag2.categories = [category3];
            await connection.manager.save(tag2);

            const loadedTags = await connection.manager
                .createQueryBuilder(Tag, "tag")
                .leftJoinAndSelect("tag.categories", "categories")
                .orderBy("tag.code, categories.code")
                .getMany();

            expect(loadedTags[0].categories).not.toEqual([]);
            expect(loadedTags[0].categories[0].name).toEqual("cars");
            expect(loadedTags[0].categories[0].type).toEqual("common-category");
            expect(loadedTags[0].categories[1].name).toEqual("BMW");
            expect(loadedTags[0].categories[1].type).toEqual("cars-category");
            expect(loadedTags[1].categories).not.toEqual([]);
            expect(loadedTags[1].categories[0].name).toEqual("airplanes");
            expect(loadedTags[1].categories[0].type).toEqual("common-category");

            const loadedTag = await connection.manager
                .createQueryBuilder(Tag, "tag")
                .leftJoinAndSelect("tag.categories", "categories")
                .orderBy("categories.code")
                .where("tag.code = :code", { code: 1 })
                .getOne();

            expect(loadedTag!.categories).not.toEqual([]);
            expect(loadedTag!.categories[0].name).toEqual("cars");
            expect(loadedTag!.categories[0].type).toEqual("common-category");

        })));

        test("should load related entity when both entities have multiple primary columns and JoinTable used with options", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "BMW";
            category2.type = "cars-category";
            category2.code = 2;
            category2.version = 1;
            await connection.manager.save(category2);

            const category3 = new Category();
            category3.name = "airplanes";
            category3.type = "common-category";
            category3.code = 3;
            category3.version = 1;
            await connection.manager.save(category3);

            const tag1 = new Tag();
            tag1.code = 1;
            tag1.title = "About BMW";
            tag1.description = "Tag about BMW";
            tag1.categoriesWithOptions = [category1, category2];
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.code = 2;
            tag2.title = "About Boeing";
            tag2.description = "Tag about Boeing";
            tag2.categoriesWithOptions = [category3];
            await connection.manager.save(tag2);

            const loadedTags = await connection.manager
                .createQueryBuilder(Tag, "tag")
                .leftJoinAndSelect("tag.categoriesWithOptions", "categories")
                .orderBy("tag.code, categories.code")
                .getMany();

            expect(loadedTags[0].categoriesWithOptions).not.toEqual([]);
            expect(loadedTags[0].categoriesWithOptions[0].name).toEqual("cars");
            expect(loadedTags[0].categoriesWithOptions[0].type).toEqual("common-category");
            expect(loadedTags[0].categoriesWithOptions[1].name).toEqual("BMW");
            expect(loadedTags[0].categoriesWithOptions[1].type).toEqual("cars-category");
            expect(loadedTags[1].categoriesWithOptions).not.toEqual([]);
            expect(loadedTags[1].categoriesWithOptions[0].name).toEqual("airplanes");
            expect(loadedTags[1].categoriesWithOptions[0].type).toEqual("common-category");

            const loadedTag = await connection.manager
                .createQueryBuilder(Tag, "tag")
                .leftJoinAndSelect("tag.categoriesWithOptions", "categories")
                .orderBy("categories.code")
                .where("tag.code = :code", { code: 1 })
                .getOne();

            expect(loadedTag!.categoriesWithOptions).not.toEqual([]);
            expect(loadedTag!.categoriesWithOptions[0].name).toEqual("cars");
            expect(loadedTag!.categoriesWithOptions[0].type).toEqual("common-category");

        })));

        test("should load related entity when both entities have multiple primary columns and JoinTable references with non-primary columns", () => Promise.all(connections.map(async connection => {

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            category1.description = "category of cars";
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "BMW";
            category2.type = "cars-category";
            category2.code = 2;
            category2.version = 1;
            category2.description = "category of BMW";
            await connection.manager.save(category2);

            const category3 = new Category();
            category3.name = "airplanes";
            category3.type = "common-category";
            category3.code = 3;
            category3.version = 1;
            category3.description = "category of airplanes";
            await connection.manager.save(category3);

            const tag1 = new Tag();
            tag1.code = 1;
            tag1.title = "About BMW";
            tag1.description = "Tag about BMW";
            tag1.categoriesWithNonPKColumns = [category1, category2];
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.code = 2;
            tag2.title = "About Boeing";
            tag2.description = "Tag about Boeing";
            tag2.categoriesWithNonPKColumns = [category3];
            await connection.manager.save(tag2);

            const loadedTags = await connection.manager
                .createQueryBuilder(Tag, "tag")
                .leftJoinAndSelect("tag.categoriesWithNonPKColumns", "categories")
                .orderBy("tag.code, categories.code")
                .getMany();

            expect(loadedTags[0].categoriesWithNonPKColumns).not.toEqual([]);
            expect(loadedTags[0].categoriesWithNonPKColumns[0].code).toEqual(1);
            expect(loadedTags[0].categoriesWithNonPKColumns[0].version).toEqual(1);
            expect(loadedTags[0].categoriesWithNonPKColumns[0].description).toEqual("category of cars");
            expect(loadedTags[0].categoriesWithNonPKColumns[1].code).toEqual(2);
            expect(loadedTags[0].categoriesWithNonPKColumns[1].version).toEqual(1);
            expect(loadedTags[0].categoriesWithNonPKColumns[1].description).toEqual("category of BMW");
            expect(loadedTags[1].categoriesWithNonPKColumns).not.toEqual([]);
            expect(loadedTags[1].categoriesWithNonPKColumns[0].code).toEqual(3);
            expect(loadedTags[1].categoriesWithNonPKColumns[0].version).toEqual(1);
            expect(loadedTags[1].categoriesWithNonPKColumns[0].description).toEqual("category of airplanes");

            const loadedTag = await connection.manager
                .createQueryBuilder(Tag, "tag")
                .leftJoinAndSelect("tag.categoriesWithNonPKColumns", "categories")
                .orderBy("categories.code")
                .where("tag.code = :code", { code: 1 })
                .getOne();

            expect(loadedTag!.categoriesWithNonPKColumns).not.toEqual([]);
            expect(loadedTag!.categoriesWithNonPKColumns[0].code).toEqual(1);
            expect(loadedTag!.categoriesWithNonPKColumns[0].version).toEqual(1);
            expect(loadedTag!.categoriesWithNonPKColumns[0].description).toEqual("category of cars");

        })));

    });

    describe("inverse side", () => {

        test("should load related entity when JoinTable used without options", () => Promise.all(connections.map(async connection => {

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
            expect(loadedCategories[0].posts[1].id).toEqual(2);
            expect(loadedCategories[1].posts).not.toEqual([]);
            expect(loadedCategories[1].posts[0].id).toEqual(3);

            const loadedCategory = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.posts", "posts")
                .orderBy("posts.id")
                .where("category.code = :code", { code: 1 })
                .getOne();

            expect(loadedCategory!.posts).not.toEqual([]);
            expect(loadedCategory!.posts[0].id).toEqual(1);
            expect(loadedCategory!.posts[1].id).toEqual(2);

        })));

        test("should load related entity when JoinTable used with options", () => Promise.all(connections.map(async connection => {

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
            expect(loadedCategories[0].postsWithOptions[1].id).toEqual(2);
            expect(loadedCategories[1].postsWithOptions).not.toEqual([]);
            expect(loadedCategories[1].postsWithOptions[0].id).toEqual(3);

            const loadedCategory = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.postsWithOptions", "posts")
                .orderBy("posts.id")
                .where("category.code = :code", { code: 1 })
                .getOne();

            expect(loadedCategory!.postsWithOptions).not.toEqual([]);
            expect(loadedCategory!.postsWithOptions[0].id).toEqual(1);
            expect(loadedCategory!.postsWithOptions[1].id).toEqual(2);

        })));

        test("should load related entity when JoinTable references with non-primary columns", () => Promise.all(connections.map(async connection => {

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
            expect(loadedCategories[0].postsWithNonPKColumns[1].id).toEqual(2);
            expect(loadedCategories[1].postsWithNonPKColumns).not.toEqual([]);
            expect(loadedCategories[1].postsWithNonPKColumns[0].id).toEqual(3);

            const loadedCategory = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.postsWithNonPKColumns", "posts")
                .orderBy("posts.id")
                .where("category.code = :code", { code: 1 })
                .getOne();

            expect(loadedCategory!.postsWithNonPKColumns).not.toEqual([]);
            expect(loadedCategory!.postsWithNonPKColumns[0].id).toEqual(1);
            expect(loadedCategory!.postsWithNonPKColumns[1].id).toEqual(2);

        })));

        test("should load related entity when both entities have multiple primary columns and JoinTable used without options", () => Promise.all(connections.map(async connection => {

            const tag1 = new Tag();
            tag1.code = 1;
            tag1.title = "About BMW";
            tag1.description = "Tag about BMW";
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.code = 2;
            tag2.title = "About Audi";
            tag2.description = "Tag about Audi";
            await connection.manager.save(tag2);

            const tag3 = new Tag();
            tag3.code = 3;
            tag3.title = "About Boeing";
            tag3.description = "tag about Boeing";
            await connection.manager.save(tag3);

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            category1.tags = [tag1, tag2];
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            category2.type = "common-category";
            category2.code = 2;
            category2.version = 1;
            category2.tags = [tag3];
            await connection.manager.save(category2);

            const loadedCategories = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.tags", "tags")
                .orderBy("category.code, tags.code")
                .getMany();

            expect(loadedCategories[0].tags).not.toEqual([]);
            expect(loadedCategories[0].tags[0].title).toEqual("About BMW");
            expect(loadedCategories[0].tags[0].description).toEqual("Tag about BMW");
            expect(loadedCategories[0].tags[1].title).toEqual("About Audi");
            expect(loadedCategories[0].tags[1].description).toEqual("Tag about Audi");
            expect(loadedCategories[1].tags).not.toEqual([]);
            expect(loadedCategories[1].tags[0].title).toEqual("About Boeing");
            expect(loadedCategories[1].tags[0].description).toEqual("tag about Boeing");

            const loadedCategory = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.tags", "tags")
                .orderBy("tags.code")
                .where("category.code = :code", { code: 1 })
                .getOne();

            expect(loadedCategory!.tags).not.toEqual([]);
            expect(loadedCategory!.tags[0].title).toEqual("About BMW");
            expect(loadedCategory!.tags[0].description).toEqual("Tag about BMW");

        })));

        test("should load related entity when both entities have multiple primary columns and JoinTable used with options", () => Promise.all(connections.map(async connection => {

            const tag1 = new Tag();
            tag1.code = 1;
            tag1.title = "About BMW";
            tag1.description = "Tag about BMW";
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.code = 2;
            tag2.title = "About Audi";
            tag2.description = "Tag about Audi";
            await connection.manager.save(tag2);

            const tag3 = new Tag();
            tag3.code = 3;
            tag3.title = "About Boeing";
            tag3.description = "tag about Boeing";
            await connection.manager.save(tag3);

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            category1.tagsWithOptions = [tag1, tag2];
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            category2.type = "common-category";
            category2.code = 2;
            category2.version = 1;
            category2.tagsWithOptions = [tag3];
            await connection.manager.save(category2);

            const loadedCategories = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.tagsWithOptions", "tags")
                .orderBy("category.code, tags.code")
                .getMany();

            expect(loadedCategories[0].tagsWithOptions).not.toEqual([]);
            expect(loadedCategories[0].tagsWithOptions[0].title).toEqual("About BMW");
            expect(loadedCategories[0].tagsWithOptions[0].description).toEqual("Tag about BMW");
            expect(loadedCategories[0].tagsWithOptions[1].title).toEqual("About Audi");
            expect(loadedCategories[0].tagsWithOptions[1].description).toEqual("Tag about Audi");
            expect(loadedCategories[1].tagsWithOptions).not.toEqual([]);
            expect(loadedCategories[1].tagsWithOptions[0].title).toEqual("About Boeing");
            expect(loadedCategories[1].tagsWithOptions[0].description).toEqual("tag about Boeing");

            const loadedCategory = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.tagsWithOptions", "tags")
                .orderBy("tags.code")
                .where("category.code = :code", { code: 1 })
                .getOne();

            expect(loadedCategory!.tagsWithOptions).not.toEqual([]);
            expect(loadedCategory!.tagsWithOptions[0].title).toEqual("About BMW");
            expect(loadedCategory!.tagsWithOptions[0].description).toEqual("Tag about BMW");

        })));

        test("should load related entity when both entities have multiple primary columns and JoinTable references with non-primary columns", () => Promise.all(connections.map(async connection => {

            const tag1 = new Tag();
            tag1.code = 1;
            tag1.title = "About BMW";
            tag1.description = "Tag about BMW";
            await connection.manager.save(tag1);

            const tag2 = new Tag();
            tag2.code = 2;
            tag2.title = "About Audi";
            tag2.description = "Tag about Audi";
            await connection.manager.save(tag2);

            const tag3 = new Tag();
            tag3.code = 3;
            tag3.title = "About Boeing";
            tag3.description = "tag about Boeing";
            await connection.manager.save(tag3);

            const category1 = new Category();
            category1.name = "cars";
            category1.type = "common-category";
            category1.code = 1;
            category1.version = 1;
            category1.description = "category of cars";
            category1.tagsWithNonPKColumns = [tag1, tag2];
            await connection.manager.save(category1);

            const category2 = new Category();
            category2.name = "airplanes";
            category2.type = "common-category";
            category2.code = 2;
            category2.version = 1;
            category2.description = "category of airplanes";
            category2.tagsWithNonPKColumns = [tag3];
            await connection.manager.save(category2);

            const loadedCategories = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.tagsWithNonPKColumns", "tags")
                .orderBy("category.code, tags.code")
                .getMany();

            expect(loadedCategories[0].tagsWithNonPKColumns).not.toEqual([]);
            expect(loadedCategories[0].tagsWithNonPKColumns[0].title).toEqual("About BMW");
            expect(loadedCategories[0].tagsWithNonPKColumns[0].description).toEqual("Tag about BMW");
            expect(loadedCategories[0].tagsWithNonPKColumns[1].title).toEqual("About Audi");
            expect(loadedCategories[0].tagsWithNonPKColumns[1].description).toEqual("Tag about Audi");
            expect(loadedCategories[1].tagsWithNonPKColumns).not.toEqual([]);
            expect(loadedCategories[1].tagsWithNonPKColumns[0].title).toEqual("About Boeing");
            expect(loadedCategories[1].tagsWithNonPKColumns[0].description).toEqual("tag about Boeing");

            const loadedCategory = await connection.manager
                .createQueryBuilder(Category, "category")
                .leftJoinAndSelect("category.tagsWithNonPKColumns", "tags")
                .orderBy("tags.code")
                .where("category.code = :code", { code: 1 })
                .getOne();

            expect(loadedCategory!.tagsWithNonPKColumns).not.toEqual([]);
            expect(loadedCategory!.tagsWithNonPKColumns[0].title).toEqual("About BMW");
            expect(loadedCategory!.tagsWithNonPKColumns[0].description).toEqual("Tag about BMW");

        })));

    });

});
