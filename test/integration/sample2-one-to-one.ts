import {expect} from "../deps/chai.ts";
import {runIfMain} from "../deps/mocha.ts";
import {Connection} from "../../src/connection/Connection.ts";
import {createConnection} from "../../src/index.ts";
import {Repository} from "../../src/repository/Repository.ts";
import {PostDetails} from "../../sample/sample2-one-to-one/entity/PostDetails.ts";
import {Post} from "../../sample/sample2-one-to-one/entity/Post.ts";
import {PostCategory} from "../../sample/sample2-one-to-one/entity/PostCategory.ts";
import {PostAuthor} from "../../sample/sample2-one-to-one/entity/PostAuthor.ts";
import {PostMetadata} from "../../sample/sample2-one-to-one/entity/PostMetadata.ts";
import {PostImage} from "../../sample/sample2-one-to-one/entity/PostImage.ts";
import {PostInformation} from "../../sample/sample2-one-to-one/entity/PostInformation.ts";
import {setupSingleTestingConnection} from "../utils/test-utils.ts";

// TODO(uki00a) Remove `.skip` whe  mysql driver is implemented.
describe.skip("one-to-one", function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    // connect to db
    let connection: Connection;
    before(async function() {
        const options = setupSingleTestingConnection("mysql", {
            entities: [Post, PostDetails, PostCategory, PostMetadata, PostImage, PostInformation, PostAuthor],
        });
        if (!options)
            return;

        connection = await createConnection(options);
    });

    after(() => connection.close());

    // clean up database before each test
    function reloadDatabase() {
        if (!connection)
            return;
        return connection.synchronize(true);
    }

    let postRepository: Repository<Post>,
        postDetailsRepository: Repository<PostDetails>,
        postCategoryRepository: Repository<PostCategory>,
        postImageRepository: Repository<PostImage>,
        postMetadataRepository: Repository<PostMetadata>;
    before(function() {
        if (!connection)
            return;

        postRepository = connection.getRepository(Post);
        postDetailsRepository = connection.getRepository(PostDetails);
        postCategoryRepository = connection.getRepository(PostCategory);
        postImageRepository = connection.getRepository(PostImage);
        postMetadataRepository = connection.getRepository(PostMetadata);
    });

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    describe("insert post and details (has inverse relation + full cascade options)", function() {
        if (!connection)
            return;

        let newPost: Post, details: PostDetails, savedPost: Post;

        before(reloadDatabase);

        before(function() {
            details = new PostDetails();
            details.authorName = "Umed";
            details.comment = "this is post";
            details.metadata = "post,posting,postman";

            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";
            newPost.details = details;
            return postRepository.save(newPost).then(post => savedPost = post as Post);
        });

        it("should return the same post instance after its created", function () {
            savedPost.should.be.equal(newPost);
        });

        it("should return the same post details instance after its created", function () {
            savedPost.details.should.be.equal(newPost.details);
        });

        it("should have a new generated id after post is created", function () {
            expect(savedPost.id).not.to.be.undefined;
            expect(savedPost.details.id).not.to.be.undefined;
        });

        it("should have inserted post in the database", async function() {
            if (!connection)
                return;
            const expectedPost = new Post();
            expectedPost.id = savedPost.id;
            expectedPost.text = savedPost.text;
            expectedPost.title = savedPost.title;

            return expect(await postRepository.findOne(savedPost.id)).to.eql(expectedPost);
        });

        it("should have inserted post details in the database", async function() {
            if (!connection)
                return;
            const expectedDetails = new PostDetails();
            expectedDetails.id = savedPost.details.id;
            expectedDetails.authorName = savedPost.details.authorName;
            expectedDetails.comment = savedPost.details.comment;
            expectedDetails.metadata = savedPost.details.metadata;

            const loadedPostDetails = await postDetailsRepository.findOne(savedPost.details.id);
            loadedPostDetails!.should.be.eql(expectedDetails);
        });

        it("should load post and its details if left join used", async function() {
            if (!connection)
                return;
            const expectedPost = new Post();
            expectedPost.id = savedPost.id;
            expectedPost.text = savedPost.text;
            expectedPost.title = savedPost.title;
            expectedPost.details = new PostDetails();
            expectedPost.details.id = savedPost.details.id;
            expectedPost.details.authorName = savedPost.details.authorName;
            expectedPost.details.comment = savedPost.details.comment;
            expectedPost.details.metadata = savedPost.details.metadata;

            const post = await postRepository
                .createQueryBuilder("post")
                .leftJoinAndSelect("post.details", "details")
                .where("post.id=:id")
                .setParameter("id", savedPost.id)
                .getOne();

            expect(post).not.to.be.undefined;
            post!.should.eql(expectedPost);
        });

        it("should load details and its post if left join used (from reverse side)", async function() {
            if (!connection)
                return;

            const expectedDetails = new PostDetails();
            expectedDetails.id = savedPost.details.id;
            expectedDetails.authorName = savedPost.details.authorName;
            expectedDetails.comment = savedPost.details.comment;
            expectedDetails.metadata = savedPost.details.metadata;

            expectedDetails.post = new Post();
            expectedDetails.post.id = savedPost.id;
            expectedDetails.post.text = savedPost.text;
            expectedDetails.post.title = savedPost.title;

            const actualDetails = await postDetailsRepository
                .createQueryBuilder("details")
                .leftJoinAndSelect("details.post", "post")
                .where("details.id=:id")
                .setParameter("id", savedPost.id)
                .getOne();
            expect(actualDetails).to.eql(expectedDetails);
        });

        it("should load saved post without details if left joins are not specified", async function() {
            const expectedPost = new Post();
            expectedPost.id = savedPost.id;
            expectedPost.text = savedPost.text;
            expectedPost.title = savedPost.title;

            const actualPost = await postRepository
                .createQueryBuilder("post")
                .where("post.id=:id", { id: savedPost.id })
                .getOne();
            expect(actualPost).to.eql(expectedPost);
        });

        it("should load saved post without details if left joins are not specified", async function() {
            const expectedDetails = new PostDetails();
            expectedDetails.id = savedPost.details.id;
            expectedDetails.authorName = savedPost.details.authorName;
            expectedDetails.comment = savedPost.details.comment;
            expectedDetails.metadata = savedPost.details.metadata;

            const actualDetails = await postDetailsRepository
                .createQueryBuilder("details")
                .where("details.id=:id", { id: savedPost.id })
                .getOne();
            expect(actualDetails).to.eql(expectedDetails);
        });

    });

    describe("insert post and category (one-side relation)", function() {
        if (!connection)
            return;

        let newPost: Post, category: PostCategory, savedPost: Post;

        before(reloadDatabase);

        before(function() {
            category = new PostCategory();
            category.name = "technology";

            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";
            newPost.category = category;

            return postRepository.save(newPost).then(post => savedPost = post as Post);
        });

        it("should return the same post instance after its created", function () {
            savedPost.should.be.equal(newPost);
        });

        it("should return the same post category instance after its created", function () {
            savedPost.category.should.be.equal(newPost.category);
        });

        it("should have a new generated id after post is created", function () {
            expect(savedPost.id).not.to.be.undefined;
            expect(savedPost.category.id).not.to.be.undefined;
        });

        it("should have inserted post in the database", async function() {
            const expectedPost = new Post();
            expectedPost.id = savedPost.id;
            expectedPost.text = savedPost.text;
            expectedPost.title = savedPost.title;
            const actualPost = await postRepository.findOne(savedPost.id);
            expect(actualPost).to.eql(expectedPost);
        });

        it("should have inserted category in the database", async function() {
            const expectedPost = new PostCategory();
            expectedPost.id = savedPost.category.id;
            expectedPost.name = "technology";
            const actualPost = postCategoryRepository.findOne(savedPost.category.id);
            expect(actualPost).to.eql(expectedPost);
        });

        it("should load post and its category if left join used", async function() {
            const expectedPost = new Post();
            expectedPost.id = savedPost.id;
            expectedPost.title = savedPost.title;
            expectedPost.text = savedPost.text;
            expectedPost.category = new PostCategory();
            expectedPost.category.id = savedPost.category.id;
            expectedPost.category.name = savedPost.category.name;

            const actualPost = postRepository
                .createQueryBuilder("post")
                .leftJoinAndSelect("post.category", "category")
                .where("post.id=:id", { id: savedPost.id })
                .getOne();
            expect(actualPost).to.eql(expectedPost);
        });

        it("should load details and its post if left join used (from reverse side)", function() {
            // later need to specify with what exception we reject it
            /*return postCategoryRepository
                .createQueryBuilder("category")
                .leftJoinAndSelect("category.post", "post")
                .where("category.id=:id", { id: savedPost.id })
                .getSingleResult()
                .should.be.rejectedWith(Error);*/ // not working, find fix
        });

    });

    describe("cascade updates should not be executed when cascadeUpdate option is not set", function() {
        if (!connection)
            return;
        let newPost: Post, details: PostDetails;

        before(reloadDatabase);

        before(function() {

            details = new PostDetails();
            details.authorName = "Umed";
            details.comment = "this is post";
            details.metadata = "post,posting,postman";

            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";
            newPost.details = details;

            return postRepository.save(newPost);
        });

        it("should ignore updates in the model and do not update the db when entity is updated", function () {
            newPost.details.comment = "i am updated comment";
            return postRepository.save(newPost).then(updatedPost => {
                updatedPost.details!.comment!.should.be.equal("i am updated comment");
                return postRepository
                    .createQueryBuilder("post")
                    .leftJoinAndSelect("post.details", "details")
                    .where("post.id=:id")
                    .setParameter("id", updatedPost.id)
                    .getOne();
            }).then(updatedPostReloaded => {
                updatedPostReloaded!.details.comment.should.be.equal("this is post");
            });
        }); // todo: also check that updates throw exception in strict cascades mode
    });

    describe("cascade remove should not be executed when cascadeRemove option is not set", function() {
        if (!connection)
            return;
        let newPost: Post, details: PostDetails;

        before(reloadDatabase);

        before(function() {

            details = new PostDetails();
            details.authorName = "Umed";
            details.comment = "this is post";
            details.metadata = "post,posting,postman";

            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";
            newPost.details = details;

            return postRepository.save(newPost);
        });

        it("should ignore updates in the model and do not update the db when entity is updated", function () {
            if (!connection)
                return;
            delete newPost.details;
            return postRepository.save(newPost).then(updatedPost => {
                return postRepository
                    .createQueryBuilder("post")
                    .leftJoinAndSelect("post.details", "details")
                    .where("post.id=:id")
                    .setParameter("id", updatedPost.id)
                    .getOne();
            }).then(updatedPostReloaded => {
                updatedPostReloaded!.details.comment.should.be.equal("this is post");
            });
        });
    });

    // todo: check why it generates extra query
    describe("cascade updates should be executed when cascadeUpdate option is set", function() {
        if (!connection)
            return;
        let newPost: Post, newImage: PostImage;

        before(reloadDatabase);

        it("should update a relation successfully when updated", function () {

            newImage = new PostImage();
            newImage.url = "logo.png";

            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";

            return postImageRepository
                .save(newImage)
                .then(image => {
                    newPost.image = image as PostImage;
                    return postRepository.save(newPost);

                }).then(post => {
                    newPost = post as Post;
                    return postRepository
                        .createQueryBuilder("post")
                        .leftJoinAndSelect("post.image", "image")
                        .where("post.id=:id")
                        .setParameter("id", post.id)
                        .getOne();

                }).then(loadedPost => {
                    loadedPost!.image.url = "new-logo.png";
                    return postRepository.save(loadedPost!);

                }).then(() => {
                    return postRepository
                        .createQueryBuilder("post")
                        .leftJoinAndSelect("post.image", "image")
                        .where("post.id=:id")
                        .setParameter("id", newPost.id)
                        .getOne();

                }).then(reloadedPost => {
                    reloadedPost!.image.url.should.be.equal("new-logo.png");
                });
        });

    });

    describe("cascade remove should be executed when cascadeRemove option is set", function() {
        if (!connection)
            return;
        let newPost: Post, newMetadata: PostMetadata;

        before(reloadDatabase);

        it("should remove a relation entity successfully when removed", function () {

            newMetadata = new PostMetadata();
            newMetadata.description = "this is post metadata";

            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";

            return postMetadataRepository
                .save(newMetadata)
                .then(metadata => {
                    newPost.metadata = metadata as PostMetadata;
                    return postRepository.save(newPost);

                }).then(post => {
                    newPost = post as Post;
                    return postRepository
                        .createQueryBuilder("post")
                        .leftJoinAndSelect("post.metadata", "metadata")
                        .where("post.id=:id")
                        .setParameter("id", post.id)
                        .getOne();

                }).then(loadedPost => {
                    loadedPost!.metadata = null;
                    return postRepository.save(loadedPost!);

                }).then(() => {
                    return postRepository
                        .createQueryBuilder("post")
                        .leftJoinAndSelect("post.metadata", "metadata")
                        .where("post.id=:id")
                        .setParameter("id", newPost.id)
                        .getOne();

                }).then(reloadedPost => {
                    expect(reloadedPost!.metadata).to.not.exist;
                });
        });

    });

});

runIfMain(import.meta);
