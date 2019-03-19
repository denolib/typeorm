import "reflect-metadata";
import {getConnectionManager} from "../../../../src";
import {Connection} from "../../../../src";
import {Repository} from "../../../../src";
import {setupSingleTestingConnection} from "../../../utils/test-utils";
import {Category} from "./entity/Category";
import {CategoryMetadata} from "./entity/CategoryMetadata";
import {Post} from "./entity/Post";

describe("persistence > custom-column-names", function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    // connect to db
    let connection: Connection;
    beforeAll(async () => {
        const options = setupSingleTestingConnection("mysql", {
            entities: [Post, Category, CategoryMetadata]
        });
        if (!options)
            return;

        connection = getConnectionManager().create(options);
    });
    afterAll(() => connection.close());

    // clean up database before each test
    function reloadDatabase() {
        if (!connection)
            return;
        return connection
            .synchronize(true)
            .catch(e => {
                console.log("Error during schema re-creation: ", e);
                throw e;
            });
    }

    let postRepository: Repository<Post>;
    let categoryRepository: Repository<Category>;
    let metadataRepository: Repository<CategoryMetadata>;
    beforeAll(function() {
        if (!connection)
            return;
        postRepository = connection.getRepository(Post);
        categoryRepository = connection.getRepository(Category);
        metadataRepository = connection.getRepository(CategoryMetadata);
    });

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------
    
    describe("attach exist entity to exist entity with many-to-one relation", function() {
        if (!connection)
            return;
        let newPost: Post, newCategory: Category, loadedPost: Post;

        beforeAll(reloadDatabase);

        // save a new category
        beforeAll(function () {
            newCategory = categoryRepository.create();
            newCategory.name = "Animals";
            return categoryRepository.save(newCategory);
        });

        // save a new post
        beforeAll(function() {
            newPost = postRepository.create();
            newPost.title = "All about animals";
            return postRepository.save(newPost);
        });

        // attach category to post and save it
        beforeAll(function() {
            newPost.category = newCategory;
            return postRepository.save(newPost);
        });

        // load a post
        beforeAll(function() {
            return postRepository
                .findOne(1, { join: { alias: "post", leftJoinAndSelect: { category: "post.category" } }})
                .then(post => loadedPost = post!);
        });

        test("should contain attached category", function () {
            expect(loadedPost).not.toBeUndefined();
            expect(loadedPost.category).not.toBeUndefined();
            expect(loadedPost.categoryId).not.toBeUndefined();
        });

    });

    describe("attach new entity to exist entity with many-to-one relation", function() {
        if (!connection)
            return;
        let newPost: Post, newCategory: Category, loadedPost: Post;

        beforeAll(reloadDatabase);

        // save a new category
        beforeAll(function () {
            newCategory = categoryRepository.create();
            newCategory.name = "Animals";
            return categoryRepository.save(newCategory);
        });

        // save a new post and attach category
        beforeAll(function() {
            newPost = postRepository.create();
            newPost.title = "All about animals";
            newPost.category = newCategory;
            return postRepository.save(newPost);
        });

        // load a post
        beforeAll(function() {
            return postRepository
                .findOne(1, { join: { alias: "post", leftJoinAndSelect: { category: "post.category" } } })
                .then(post => loadedPost = post!);
        });

        test("should contain attached category", function () {
            expect(loadedPost).not.toBeUndefined();
            expect(loadedPost.category).not.toBeUndefined();
            expect(loadedPost.categoryId).not.toBeUndefined();
        });

    });

    describe("attach new entity to new entity with many-to-one relation", function() {
        if (!connection)
            return;
        let newPost: Post, newCategory: Category, loadedPost: Post;

        beforeAll(reloadDatabase);

        // save a new category, post and attach category to post
        beforeAll(function () {
            newCategory = categoryRepository.create();
            newCategory.name = "Animals";
            newPost = postRepository.create();
            newPost.title = "All about animals";
            newPost.category = newCategory;
            return postRepository.save(newPost);
        });

        // load a post
        beforeAll(function() {
            return postRepository
                .findOne(1, { join: { alias: "post", leftJoinAndSelect: { category: "post.category" } }})
                .then(post => loadedPost = post!);
        });

        test("should contain attached category", function () {
            expect(loadedPost).not.toBeUndefined();
            expect(loadedPost.category).not.toBeUndefined();
            expect(loadedPost.categoryId).not.toBeUndefined();
        });

    });

    describe("attach exist entity to exist entity with one-to-one relation", function() {
        if (!connection)
            return;
        let newPost: Post, newCategory: Category, newMetadata: CategoryMetadata, loadedPost: Post;

        beforeAll(reloadDatabase);

        // save a new post
        beforeAll(function() {
            newPost = postRepository.create();
            newPost.title = "All about animals";
            return postRepository.save(newPost);
        });

        // save a new category
        beforeAll(function () {
            newCategory = categoryRepository.create();
            newCategory.name = "Animals";
            return categoryRepository.save(newCategory);
        });

        // save a new metadata
        beforeAll(function() {
            newMetadata = metadataRepository.create();
            newMetadata.keyword = "animals";
            return metadataRepository.save(newMetadata);
        });

        // attach metadata to category and category to post and save it
        beforeAll(function() {
            newCategory.metadata = newMetadata;
            newPost.category = newCategory;
            return postRepository.save(newPost);
        });

        // load a post
        beforeAll(function() {
            return postRepository
                .findOne(1, { join: { alias: "post", leftJoinAndSelect: { category: "post.category", metadata: "category.metadata" } } })
                .then(post => loadedPost = post!);
        });

        test("should contain attached category and metadata in the category", function () {
            expect(loadedPost).not.toBeUndefined();
            expect(loadedPost.category).not.toBeUndefined();
            expect(loadedPost.categoryId).not.toBeUndefined();
            expect(loadedPost.category.metadata).not.toBeUndefined();
            expect(loadedPost.category.metadataId).not.toBeUndefined();
        });

    });

    describe("attach new entity to exist entity with one-to-one relation", function() {
        if (!connection)
            return;
        let newPost: Post, newCategory: Category, newMetadata: CategoryMetadata, loadedPost: Post;

        beforeAll(reloadDatabase);

        // save a new post
        beforeAll(function() {
            newPost = postRepository.create();
            newPost.title = "All about animals";
            return postRepository.save(newPost);
        });

        // save a new category and new metadata
        beforeAll(function () {
            newMetadata = metadataRepository.create();
            newMetadata.keyword = "animals";
            newCategory = categoryRepository.create();
            newCategory.name = "Animals";
            newCategory.metadata = newMetadata;
            return categoryRepository.save(newCategory);
        });

        // attach metadata to category and category to post and save it
        beforeAll(function() {
            newPost.category = newCategory;
            return postRepository.save(newPost);
        });

        // load a post
        beforeAll(function() {
            return postRepository
                .findOne(1, { join: { alias: "post", leftJoinAndSelect: { category: "post.category", metadata: "category.metadata" } } })
                .then(post => loadedPost = post!);
        });

        test("should contain attached category and metadata in the category", function () {
            expect(loadedPost).not.toBeUndefined();
            expect(loadedPost.category).not.toBeUndefined();
            expect(loadedPost.categoryId).not.toBeUndefined();
            expect(loadedPost.category.metadata).not.toBeUndefined();
            expect(loadedPost.category.metadataId).not.toBeUndefined();
        });

    });

});
