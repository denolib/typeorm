import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {QueryBuilder} from "../../../../src";
import {User} from "./model/User";
import questionSchema from "./model-schema/QuestionSchema";
import {Question} from "./model/Question";
import {Blog} from "./entity/Blog";
import {Category} from "./entity/Category";
import {DeepPartial} from "../../../../src";
import {EntitySchema} from "../../../../src";

describe("repository > basic methods", () => {

    let userSchema: any;
    try {
        const resourceDir = __dirname + "/../../../../../../test/functional/repository/basic-methods/";
        userSchema = require(resourceDir + "schema/user.json");
    } catch (err) {
        const resourceDir = __dirname + "/";
        userSchema = require(resourceDir + "schema/user.json");
    }
    const UserEntity = new EntitySchema<any>(userSchema);
    const QuestionEntity = new EntitySchema<any>(questionSchema as any);

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post, Blog, Category, UserEntity, QuestionEntity],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    describe("target", function() {

        test("should return instance of the object it manages", () => connections.forEach(connection => {
            const postRepository = connection.getRepository(Post);
            expect(postRepository.target).toEqual(Post);
            const userRepository = connection.getRepository<User>("User");
            expect(userRepository.target).toEqual("User");
            const questionRepository = connection.getRepository<Question>("Question");
            expect(questionRepository.target).toBeInstanceOf(Function);
        }));

    });
    
    describe("hasId", function() {

        test("should return true if entity has an id", () => connections.forEach(connection => {
            const postRepository = connection.getRepository(Post);
            const userRepository = connection.getRepository("User");

            const postWithId = new Post();
            postWithId.id = 1;
            postWithId.title = "Hello post";
            expect(postRepository.hasId(postWithId)).toEqual(true);

            const postWithZeroId = new Post();
            postWithZeroId.id = 0;
            postWithZeroId.title = "Hello post";
            expect(postRepository.hasId(postWithZeroId)).toEqual(true);

            const userWithId: User = {
                id: 1,
                firstName: "Jonh",
                secondName: "Doe"
            };
            expect(userRepository.hasId(userWithId)).toEqual(true);

            const userWithZeroId: User = {
                id: 1,
                firstName: "Jonh",
                secondName: "Doe"
            };
            expect(userRepository.hasId(userWithZeroId)).toEqual(true);

        }));

        test("should return false if entity does not have an id", () => connections.forEach(connection => {
            const postRepository = connection.getRepository(Post);
            const userRepository = connection.getRepository("User");

            expect(postRepository.hasId(null as any)).toEqual(false);
            expect(postRepository.hasId(undefined as any)).toEqual(false);

            const postWithoutId = new Post();
            postWithoutId.title = "Hello post";
            expect(postRepository.hasId(postWithoutId)).toEqual(false);

            const postWithUndefinedId = new Post();
            postWithUndefinedId.id = undefined;
            postWithUndefinedId.title = "Hello post";
            expect(postRepository.hasId(postWithUndefinedId)).toEqual(false);

            const postWithNullId = new Post();
            postWithNullId.id = null;
            postWithNullId.title = "Hello post";
            expect(postRepository.hasId(postWithNullId)).toEqual(false);

            const postWithEmptyId = new Post();
            postWithEmptyId.id = "";
            postWithEmptyId.title = "Hello post";
            expect(postRepository.hasId(postWithEmptyId)).toEqual(false);

            const userWithoutId: User = {
                firstName: "Jonh",
                secondName: "Doe"
            };
            expect(userRepository.hasId(userWithoutId)).toEqual(false);

            const userWithNullId: User = {
                id: null,
                firstName: "Jonh",
                secondName: "Doe"
            };
            expect(userRepository.hasId(userWithNullId)).toEqual(false);

            const userWithUndefinedId: User = {
                id: undefined,
                firstName: "Jonh",
                secondName: "Doe"
            };
            expect(userRepository.hasId(userWithUndefinedId)).toEqual(false);
        }));

    });

    describe("createQueryBuilder", function() {

        test("should create a new query builder with the given alias", () => connections.forEach(connection => {
            const postRepository = connection.getRepository(Post);
            const postQb = postRepository.createQueryBuilder("post");
            expect(postQb).toBeInstanceOf(QueryBuilder);
            expect(postQb.alias).toEqual("post");
            const userRepository = connection.getRepository("User");
            const userQb = userRepository.createQueryBuilder("user");
            expect(userQb).toBeInstanceOf(QueryBuilder);
            expect(userQb.alias).toEqual("user");
            const questionRepository = connection.getRepository("Question");
            const questionQb = questionRepository.createQueryBuilder("question");
            expect(questionQb).toBeInstanceOf(QueryBuilder);
            expect(questionQb.alias).toEqual("question");
        }));

    });

    describe("create", function() {

        test("should create a new instance of the object we are working with", () => connections.forEach(connection => {
            const repository = connection.getRepository(Post);
            expect(repository.create()).toBeInstanceOf(Post);
        }));

        test("should create a new empty object if entity schema is used", () => connections.forEach(connection => {
            const repository = connection.getRepository("User");
            expect(repository.create()).toEqual({});
        }));

        test("should create a new empty object if entity schema with a target is used", () => connections.forEach(connection => {
            const repository = connection.getRepository<Question>("Question");
            expect(repository.create()).not.toBeUndefined();
            expect(repository.create()).not.toBeNull();
            expect(repository.create().type).toEqual("question"); // make sure this is our Question function
        }));

        test("should create an entity and copy to it all properties of the given plain object if its given", () => connections.forEach(connection => {
            const postRepository = connection.getRepository(Post);
            const userRepository = connection.getRepository<User>("User");
            const questionRepository = connection.getRepository<Question>("Question");

            const plainPost = { id: 2, title: "Hello post" };
            const post = postRepository.create(plainPost);
            expect(post).toBeInstanceOf(Post);
            expect((post.id as number)).toEqual(2);
            expect( post.title).toEqual("Hello post");

            const plainUser = { id: 3, firstName: "John", secondName: "Doe" };
            const user = userRepository.create(plainUser);
            expect((user.id as number)).toEqual(3);
            expect((user.firstName as string)).toEqual("John");
            expect((user.secondName as string)).toEqual("Doe");

            const plainQuestion = { id: 3, title: "What is better?" };
            const question = questionRepository.create(plainQuestion);
            expect((question.id as number)).toEqual(3);
            expect((question.title as string)).toEqual("What is better?");
        }));

    });

    describe("createMany", function() {

        test("should create entities and copy to them all properties of the given plain object if its given", () => connections.forEach(connection => {
            const postRepository = connection.getRepository(Post);
            const plainPosts = [{ id: 2, title: "Hello post" }, { id: 3, title: "Bye post" }];
            const posts = postRepository.create(plainPosts);
            expect(posts.length).toEqual(2);
            expect(posts[0]).toBeInstanceOf(Post);
            expect((posts[0].id as number)).toEqual(2);
            expect(posts[0].title).toEqual("Hello post");
            expect(posts[1]).toBeInstanceOf(Post);
            expect((posts[1].id as number)).toEqual(3);
            expect(posts[1].title).toEqual("Bye post");
        }));

    });

    describe("preload", function() {

        test("should preload entity from the given object with only id", () => Promise.all(connections.map(async connection => {
            const blogRepository = connection.getRepository(Blog);
            const categoryRepository = connection.getRepository(Category);

            // save the category
            const category = new Category();
            category.name = "people";
            await categoryRepository.save(category);

            // save the blog
            const blog = new Blog();
            blog.title = "About people";
            blog.text = "Blog about good people";
            blog.categories = [category];
            await blogRepository.save(blog);
            
            // and preload it
            const plainBlogWithId = { id: 1 };
            const preloadedBlog = await blogRepository.preload(plainBlogWithId);
            expect(preloadedBlog)!.toBeInstanceOf(Blog);
            expect(preloadedBlog!.id).toEqual(1);
            expect(preloadedBlog!.title).toEqual("About people");
            expect(preloadedBlog!.text).toEqual("Blog about good people");
        })));

        it("should preload entity and all relations given in the object", () => Promise.all(connections.map(async connection => {
            const blogRepository = connection.getRepository(Blog);
            const categoryRepository = connection.getRepository(Category);

            // save the category
            const category = new Category();
            category.name = "people";
            await categoryRepository.save(category);

            // save the blog
            const blog = new Blog();
            blog.title = "About people";
            blog.text = "Blog about good people";
            blog.categories = [category];
            await blogRepository.save(blog);
            
            // and preload it
            const plainBlogWithId = { id: 1, categories: [{ id: 1 }] };
            const preloadedBlog = await blogRepository.preload(plainBlogWithId);
            expect(preloadedBlog)!.toBeInstanceOf(Blog);
            expect(preloadedBlog!.id).toEqual(1);
            expect(preloadedBlog!.title).toEqual("About people");
            expect(preloadedBlog!.text).toEqual("Blog about good people");
            expect(preloadedBlog!.categories[0].id).toEqual(1);
            expect(preloadedBlog!.categories[0].name).toEqual("people");
        })));

    });

    describe("merge", function() {

        test("should merge multiple entities", () => Promise.all(connections.map(async connection => {
            const blogRepository = connection.getRepository(Blog);

            const originalEntity = new Blog();

            // first entity
            const blog1 = new Blog();
            blog1.title = "First Blog";

            // second entity
            const blog2 = new Blog();
            blog2.text = "text is from second blog";

            // third entity
            const category = new Category();
            category.name = "category from third blog";
            const blog3 = new Blog();
            blog3.categories = [category];

            const mergedBlog = blogRepository.merge(originalEntity, blog1, blog2, blog3);

            expect(mergedBlog).toBeInstanceOf(Blog);
            expect(mergedBlog).toEqual(originalEntity);
            expect(mergedBlog).not.toEqual(blog1);
            expect(mergedBlog).not.toEqual(blog2);
            expect(mergedBlog).not.toEqual(blog3);
            expect(mergedBlog.title).toEqual("First Blog");
            expect(mergedBlog.text).toEqual("text is from second blog");
            expect(mergedBlog.categories[0].name).toEqual("category from third blog");
        })));

        test("should merge both entities and plain objects", () => Promise.all(connections.map(async connection => {
            const blogRepository = connection.getRepository(Blog);

            const originalEntity = new Blog();

            // first entity
            const blog1 = { title: "First Blog" };

            // second entity
            const blog2 = { text: "text is from second blog" };

            // third entity
            const blog3 = new Blog();
            blog3.categories = [{ name: "category from third blog" } as Category];

            const mergedBlog = blogRepository.merge(originalEntity, blog1, blog2, blog3);

            expect(mergedBlog).toBeInstanceOf(Blog);
            expect(mergedBlog).toEqual(originalEntity);
            expect(mergedBlog).not.toEqual(blog1);
            expect(mergedBlog).not.toEqual(blog2);
            expect(mergedBlog).not.toEqual(blog3);
            expect(mergedBlog.title).toEqual("First Blog");
            expect(mergedBlog.text).toEqual("text is from second blog");
            expect(mergedBlog.categories[0].name).toEqual("category from third blog");
        })));

    });

    describe("save", function () {
        test("should update existing entity using transformers", async () => {
            const connection = connections.find((c: Connection) => c.name === "sqlite");
            if (!connection || (connection.options as any).skip === true) {
                return;
            }

            const post = new Post();
            const date = new Date("2018-01-01 01:00:00");
            post.dateAdded = date;
            post.title = "Post title";
            post.id = 1;

            const postRepository = connection.getRepository(Post);

            await postRepository.save(post);

            const dbPost = await postRepository.findOne(post.id) as Post;
            expect(dbPost).toBeInstanceOf(Post);
            expect(dbPost.dateAdded).toBeInstanceOf(Date);
            expect(dbPost.dateAdded.getTime()).toEqual(date.getTime());

            dbPost.title = "New title";
            const saved = await postRepository.save(dbPost);

            expect(saved).toBeInstanceOf(Post);

            expect(saved.id)!.toEqual(1);
            expect(saved.title).toEqual("New title");
            expect(saved.dateAdded).toBeInstanceOf(Date);
            expect(saved.dateAdded.getTime()).toEqual(date.getTime());
        });
    });

    describe("preload also should also implement merge functionality", function() {

        test("if we preload entity from the plain object and merge preloaded object with plain object we'll have an object from the db with the replaced properties by a plain object's properties", () => Promise.all(connections.map(async connection => {
            const blogRepository = connection.getRepository(Blog);
            const categoryRepository = connection.getRepository(Category);

            // save first category
            const firstCategory = new Category();
            firstCategory.name = "people";
            await categoryRepository.save(firstCategory);

            // save second category
            const secondCategory = new Category();
            secondCategory.name = "animals";
            await categoryRepository.save(secondCategory);

            // save the blog
            const blog = new Blog();
            blog.title = "About people";
            blog.text = "Blog about good people";
            blog.categories = [firstCategory, secondCategory];
            await blogRepository.save(blog);

            // and preload it
            const plainBlogWithId: DeepPartial<Blog> = {
                id: 1,
                title: "changed title about people",
                categories: [ { id: 1 }, { id: 2, name: "insects" } ]
            };
            const preloadedBlog = await blogRepository.preload(plainBlogWithId);
            expect(preloadedBlog)!.toBeInstanceOf(Blog);
            expect(preloadedBlog!.id).toEqual(1);
            expect(preloadedBlog!.title).toEqual("changed title about people");
            expect(preloadedBlog!.text).toEqual("Blog about good people");
            expect(preloadedBlog!.categories[0].id).toEqual(1);
            expect(preloadedBlog!.categories[0].name).toEqual("people");
            expect(preloadedBlog!.categories[1].id).toEqual(2);
            expect(preloadedBlog!.categories[1].name).toEqual("insects");
        })));

    });

    describe("query", function() {

        test("should execute the query natively and it should return the result", () => Promise.all(connections.map(async connection => {
            const repository = connection.getRepository(Blog);
            const promises: Promise<Blog>[] = [];
            for (let i = 0; i < 5; i++) { // todo: should pass with 50 items. find the problem
                const blog = new Blog();
                blog.title = "hello blog";
                blog.text = "hello blog #" + i;
                blog.counter = i * 100;
                promises.push(repository.save(blog));
            }
            await Promise.all(promises);
            // such simple query should work on all platforms, isn't it? If no - make requests specifically to platforms
            const query = `SELECT MAX(${connection.driver.escape("blog")}.${connection.driver.escape("counter")}) as ${connection.driver.escape("max")} ` +
                ` FROM ${connection.driver.escape("blog")} ${connection.driver.escape("blog")}`;
            const result = await repository.query(query);
            expect(result[0]).not.toBeUndefined();
            expect(result[0].max).not.toBeUndefined();
        })));

    });

    /*describe.skip("transaction", function() {

        test("executed queries must success", () => Promise.all(connections.map(async connection => {
            const repository = connection.getRepository(Blog);
            let blogs = await repository.find();
            expect(blogs).toEqual([]);

            const blog = new Blog();
            blog.title = "hello blog title";
            blog.text = "hello blog text";
            await repository.save(blog);
            expect(blogs).toEqual([]);

            blogs = await repository.find();
            expect(blogs.length).toEqual(1);

            await repository.transaction(async () => {
                const promises: Promise<Blog>[] = [];
                for (let i = 0; i < 100; i++) {
                    const blog = new Blog();
                    blog.title = "hello blog";
                    blog.text = "hello blog #" + i;
                    blog.counter = i * 100;
                    promises.push(repository.save(blog));
                }
                await Promise.all(promises);

                blogs = await repository.find();
                expect(blogs.length).toEqual(101);
            });

            blogs = await repository.find();
            expect(blogs.length).toEqual(101);
        })));

        test("executed queries must rollback in the case if error in transaction", () => Promise.all(connections.map(async connection => {
            const repository = connection.getRepository(Blog);
            let blogs = await repository.find();
            expect(blogs).toEqual([]);

            const blog = new Blog();
            blog.title = "hello blog title";
            blog.text = "hello blog text";
            await repository.save(blog);
            expect(blogs).toEqual([]);

            blogs = await repository.find();
            expect(blogs.length).toEqual(1);

            await repository.transaction(async () => {
                const promises: Promise<Blog>[] = [];
                for (let i = 0; i < 100; i++) {
                    const blog = new Blog();
                    blog.title = "hello blog";
                    blog.text = "hello blog #" + i;
                    blog.counter = i * 100;
                    promises.push(repository.save(blog));
                }
                await Promise.all(promises);

                blogs = await repository.find();
                expect(blogs.length).toEqual(101);

                // now send the query that will crash all for us
                throw new Error("this error will cancel all persist operations");
            }).rejected;

            blogs = await repository.find();
            expect(blogs.length).toEqual(1);
        })));

    });*/

});
