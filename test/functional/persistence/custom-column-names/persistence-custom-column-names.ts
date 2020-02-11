import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {getConnectionManager} from "../../../../src/index.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Repository} from "../../../../src/repository/Repository.ts";
import {setupSingleTestingConnection} from "../../../utils/test-utils.ts";
import {Category} from "./entity/Category.ts";
import {CategoryMetadata} from "./entity/CategoryMetadata.ts";
import {Post} from "./entity/Post.ts";

// TODO(uki00a) The tests in this file do not appear to run...
// TODO(uki00a) Remove `.skip` when MysqlDriver is implemented.
describe.skip("persistence > custom-column-names", function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    // connect to db
    let connection: Connection;
    before(async () => {
        const options = setupSingleTestingConnection("mysql", {
            entities: [Post, Category, CategoryMetadata]
        });
        console.log(options)
        if (!options)
            return;

        connection = getConnectionManager().create(options);
    });
    after(() => connection.close());

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
    before(function() {
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

        before(reloadDatabase);

        // save a new category
        before(function () {
            newCategory = categoryRepository.create();
            newCategory.name = "Animals";
            return categoryRepository.save(newCategory);
        });

        // save a new post
        before(function() {
            newPost = postRepository.create();
            newPost.title = "All about animals";
            return postRepository.save(newPost);
        });

        // attach category to post and save it
        before(function() {
            newPost.category = newCategory;
            return postRepository.save(newPost);
        });

        // load a post
        before(function() {
            return postRepository
                .findOne(1, { join: { alias: "post", leftJoinAndSelect: { category: "post.category" } }})
                .then(post => loadedPost = post!);
        });

        it("should contain attached category", function () {
            expect(loadedPost).not.to.be.undefined;
            expect(loadedPost.category).not.to.be.undefined;
            expect(loadedPost.categoryId).not.to.be.undefined;
        });

    });

    describe("attach new entity to exist entity with many-to-one relation", function() {
        if (!connection)
            return;
        let newPost: Post, newCategory: Category, loadedPost: Post;

        before(reloadDatabase);

        // save a new category
        before(function () {
            newCategory = categoryRepository.create();
            newCategory.name = "Animals";
            return categoryRepository.save(newCategory);
        });

        // save a new post and attach category
        before(function() {
            newPost = postRepository.create();
            newPost.title = "All about animals";
            newPost.category = newCategory;
            return postRepository.save(newPost);
        });

        // load a post
        before(function() {
            return postRepository
                .findOne(1, { join: { alias: "post", leftJoinAndSelect: { category: "post.category" } } })
                .then(post => loadedPost = post!);
        });

        it("should contain attached category", function () {
            expect(loadedPost).not.to.be.undefined;
            expect(loadedPost.category).not.to.be.undefined;
            expect(loadedPost.categoryId).not.to.be.undefined;
        });

    });

    describe("attach new entity to new entity with many-to-one relation", function() {
        if (!connection)
            return;
        let newPost: Post, newCategory: Category, loadedPost: Post;

        before(reloadDatabase);

        // save a new category, post and attach category to post
        before(function () {
            newCategory = categoryRepository.create();
            newCategory.name = "Animals";
            newPost = postRepository.create();
            newPost.title = "All about animals";
            newPost.category = newCategory;
            return postRepository.save(newPost);
        });

        // load a post
        before(function() {
            return postRepository
                .findOne(1, { join: { alias: "post", leftJoinAndSelect: { category: "post.category" } }})
                .then(post => loadedPost = post!);
        });

        it("should contain attached category", function () {
            expect(loadedPost).not.to.be.undefined;
            expect(loadedPost.category).not.to.be.undefined;
            expect(loadedPost.categoryId).not.to.be.undefined;
        });

    });

    describe("attach exist entity to exist entity with one-to-one relation", function() {
        if (!connection)
            return;
        let newPost: Post, newCategory: Category, newMetadata: CategoryMetadata, loadedPost: Post;

        before(reloadDatabase);

        // save a new post
        before(function() {
            newPost = postRepository.create();
            newPost.title = "All about animals";
            return postRepository.save(newPost);
        });

        // save a new category
        before(function () {
            newCategory = categoryRepository.create();
            newCategory.name = "Animals";
            return categoryRepository.save(newCategory);
        });

        // save a new metadata
        before(function() {
            newMetadata = metadataRepository.create();
            newMetadata.keyword = "animals";
            return metadataRepository.save(newMetadata);
        });

        // attach metadata to category and category to post and save it
        before(function() {
            newCategory.metadata = newMetadata;
            newPost.category = newCategory;
            return postRepository.save(newPost);
        });

        // load a post
        before(function() {
            return postRepository
                .findOne(1, { join: { alias: "post", leftJoinAndSelect: { category: "post.category", metadata: "category.metadata" } } })
                .then(post => loadedPost = post!);
        });

        it("should contain attached category and metadata in the category", function () {
            expect(loadedPost).not.to.be.undefined;
            expect(loadedPost.category).not.to.be.undefined;
            expect(loadedPost.categoryId).not.to.be.undefined;
            expect(loadedPost.category.metadata).not.to.be.undefined;
            expect(loadedPost.category.metadataId).not.to.be.undefined;
        });

    });

    describe("attach new entity to exist entity with one-to-one relation", function() {
        if (!connection)
            return;
        let newPost: Post, newCategory: Category, newMetadata: CategoryMetadata, loadedPost: Post;

        before(reloadDatabase);

        // save a new post
        before(function() {
            newPost = postRepository.create();
            newPost.title = "All about animals";
            return postRepository.save(newPost);
        });

        // save a new category and new metadata
        before(function () {
            newMetadata = metadataRepository.create();
            newMetadata.keyword = "animals";
            newCategory = categoryRepository.create();
            newCategory.name = "Animals";
            newCategory.metadata = newMetadata;
            return categoryRepository.save(newCategory);
        });

        // attach metadata to category and category to post and save it
        before(function() {
            newPost.category = newCategory;
            return postRepository.save(newPost);
        });

        // load a post
        before(function() {
            return postRepository
                .findOne(1, { join: { alias: "post", leftJoinAndSelect: { category: "post.category", metadata: "category.metadata" } } })
                .then(post => loadedPost = post!);
        });

        it("should contain attached category and metadata in the category", function () {
            expect(loadedPost).not.to.be.undefined;
            expect(loadedPost.category).not.to.be.undefined;
            expect(loadedPost.categoryId).not.to.be.undefined;
            expect(loadedPost.category.metadata).not.to.be.undefined;
            expect(loadedPost.category.metadataId).not.to.be.undefined;
        });

    });

});

runIfMain(import.meta);
