import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";
import {User} from "./entity/User.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";

describe("persistence > many-to-many", function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({ entities: [Category, Post, User] }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it("add exist element to exist object with empty many-to-many relation and save it and it should contain a new category", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);
        const userRepository = connection.getRepository(User);

        // save a new category
        const newCategory = categoryRepository.create();
        newCategory.name = "Animals";
        await categoryRepository.save(newCategory);

        // save a new post
        const newPost = postRepository.create();
        newPost.title = "All about animals";
        await postRepository.save(newPost);

        // save a new user
        const newUser = userRepository.create();
        newUser.name = "Dima";
        await userRepository.save(newUser);

        // now add a category to the post and attach post to a user and save a user
        newPost.categories = [newCategory];
        newUser.post = newPost;
        await userRepository.save(newUser);

        // load a post
        const loadedUser = await userRepository.findOne(newUser.id, {
            join: {
                alias: "user",
                leftJoinAndSelect: { post: "user.post", categories: "post.categories" }
            }
        });

        expect(loadedUser!).not.to.be.undefined;
        expect(loadedUser!.post).not.to.be.undefined;
        expect(loadedUser!.post.categories).not.to.be.undefined;

    })));

    it("remove one element from many-to-many relation should remove from the database as well", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);
        const userRepository = connection.getRepository(User);

        // save a new category
        const category1 = new Category();
        category1.name = "Animals";
        await categoryRepository.save(category1);

        // save a new category
        const category2 = new Category();
        category2.name = "Animals";
        await categoryRepository.save(category2);

        // save a new post
        const newPost = postRepository.create();
        newPost.title = "All about animals";
        await postRepository.save(newPost);

        // save a new user
        const newUser = userRepository.create();
        newUser.name = "Dima";
        await userRepository.save(newUser);

        // now categories to the post inside user and save a user
        newPost.categories = [category1, category2];
        newUser.post = newPost;
        await userRepository.save(newUser);

        // load a post
        const loadedUser1 = await userRepository.findOne(newUser.id, {
            join: {
                alias: "user",
                leftJoinAndSelect: { post: "user.post", categories: "post.categories" }
            }
        });

        expect(loadedUser1!).not.to.be.undefined;
        expect(loadedUser1!.post).not.to.be.undefined;
        expect(loadedUser1!.post.categories).not.to.be.undefined;
        expect(loadedUser1!.post.categories!.length).to.be.equal(2);

        // now remove added categories
        newPost.categories = [category1];
        newUser.post = newPost;
        await userRepository.save(newUser);

        // load a post
        const loadedUser2 = await userRepository.findOne(newUser.id, {
            join: {
                alias: "user",
                leftJoinAndSelect: { post: "user.post", categories: "post.categories" }
            }
        });

        expect(loadedUser2!).not.to.be.undefined;
        expect(loadedUser2!.post).not.to.be.undefined;
        expect(loadedUser2!.post.categories).not.to.be.undefined;
        expect(loadedUser2!.post.categories!.length).to.be.equal(1);

    })));

    it("remove all elements from many-to-many relation should remove from the database as well", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);
        const userRepository = connection.getRepository(User);

        // save a new category
        const category1 = new Category();
        category1.name = "Animals";
        await categoryRepository.save(category1);

        // save a new category
        const category2 = new Category();
        category2.name = "Animals";
        await categoryRepository.save(category2);

        // save a new post
        const newPost = postRepository.create();
        newPost.title = "All about animals";
        await postRepository.save(newPost);

        // save a new user
        const newUser = userRepository.create();
        newUser.name = "Dima";
        await userRepository.save(newUser);

        // now categories to the post inside user and save a user
        newPost.categories = [category1, category2];
        newUser.post = newPost;
        await userRepository.save(newUser);

        // load a post
        const loadedUser1 = await userRepository.findOne(newUser.id, {
            join: {
                alias: "user",
                leftJoinAndSelect: { post: "user.post", categories: "post.categories" }
            }
        });

        expect(loadedUser1!).not.to.be.undefined;
        expect(loadedUser1!.post).not.to.be.undefined;
        expect(loadedUser1!.post.categories).not.to.be.undefined;
        expect(loadedUser1!.post.categories!.length).to.be.equal(2);

        // now remove added categories
        newPost.categories = [];
        newUser.post = newPost;
        await userRepository.save(newUser);

        // load a post
        const loadedUser2 = await userRepository.findOne(newUser.id, {
            join: {
                alias: "user",
                leftJoinAndSelect: { post: "user.post", categories: "post.categories" }
            }
        });

        expect(loadedUser2!).not.to.be.undefined;
        expect(loadedUser2!.post).not.to.be.undefined;
        expect(loadedUser2!.post.categories!.length).to.be.equal(0);

    })));

    it("remove all elements (set to null) from many-to-many relation should remove from the database as well", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);
        const userRepository = connection.getRepository(User);

        // save a new category
        const category1 = new Category();
        category1.name = "Animals";
        await categoryRepository.save(category1);

        // save a new category
        const category2 = new Category();
        category2.name = "Animals";
        await categoryRepository.save(category2);

        // save a new post
        const newPost = postRepository.create();
        newPost.title = "All about animals";
        await postRepository.save(newPost);

        // save a new user
        const newUser = userRepository.create();
        newUser.name = "Dima";
        await userRepository.save(newUser);

        // now categories to the post inside user and save a user
        newPost.categories = [category1, category2];
        newUser.post = newPost;
        await userRepository.save(newUser);

        // load a post
        const loadedUser1 = await userRepository.findOne(newUser.id, {
            join: {
                alias: "user",
                leftJoinAndSelect: { post: "user.post", categories: "post.categories" }
            }
        });

        expect(loadedUser1!).not.to.be.undefined;
        expect(loadedUser1!.post).not.to.be.undefined;
        expect(loadedUser1!.post.categories).not.to.be.undefined;
        expect(loadedUser1!.post.categories!.length).to.be.equal(2);

        // now remove added categories
        newPost.categories = null;
        newUser.post = newPost;
        await userRepository.save(newUser);

        // load a post
        const loadedUser2 = await userRepository.findOne(newUser.id, {
            join: {
                alias: "user",
                leftJoinAndSelect: { post: "user.post", categories: "post.categories" }
            }
        });

        expect(loadedUser2!).not.to.be.undefined;
        expect(loadedUser2!.post).not.to.be.undefined;
        expect(loadedUser2!.post.categories!.length).to.be.equal(0);
    })));

    it("remove all elements from many-to-many relation if parent entity is removed", () => Promise.all(connections.map(async connection => {

        // save a new category
        const category1 = new Category();
        category1.name = "Animals";
        await connection.manager.save(category1);

        // save a new category
        const category2 = new Category();
        category2.name = "Animals";
        await connection.manager.save(category2);

        // save a new post
        const newPost = new Post();
        newPost.title = "All about animals";
        await connection.manager.save(newPost);

        // now categories to the post inside user and save a user
        newPost.categories = [category1, category2];
        await connection.manager.save(newPost);

        // this should not give an error:
        await connection.manager.remove(newPost);
    })));

});

runIfMain(import.meta);
