import {expect} from "../../../../deps/chai.ts";
import {runIfMain} from "../../../../deps/mocha.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";

// TODO(uki00a) Remove `.skip` when MongoDriver is implemented.
describe.skip("mongodb > basic repository actions", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("create should create instance of same entity", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        postRepository.create().should.be.instanceOf(Post);
    })));

    it("create should be able to fill data from the given object", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = postRepository.create({
            title: "This is created post",
            text: "All about this post"
        });
        post.should.be.instanceOf(Post);
        post.title.should.be.equal("This is created post");
        post.text.should.be.equal("All about this post");
    })));

    it("merge should merge all given partial objects into given source entity", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = postRepository.create({
            title: "This is created post",
            text: "All about this post"
        });
        const mergedPost = postRepository.merge(post,
            { title: "This is updated post" },
            { text: "And its text is updated as well" }
        );
        mergedPost.should.be.instanceOf(Post);
        mergedPost.should.be.equal(post);
        mergedPost.title.should.be.equal("This is updated post");
        mergedPost.text.should.be.equal("And its text is updated as well");
    })));

    it("target should be valid", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        expect(postRepository.target).not.to.be.undefined;
        postRepository.target.should.be.eql(Post);
    })));

    it("should persist entity successfully and after persistence have generated object id", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = new Post();
        post.title = "Post #1";
        post.text = "Everything about post!";
        await postRepository.save(post);

        expect(post.id).not.to.be.undefined;
    })));

    it("hasId should return true if id really has an id", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = new Post();
        post.title = "Post #1";
        post.text = "Everything about post!";
        await postRepository.save(post);

        expect(post.id).not.to.be.undefined;
        postRepository.hasId(post).should.be.true;
    })));

    it("unsupported methods should throw exception", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        expect(() => postRepository.createQueryBuilder("post")).to.throw(Error);
        expect(() => postRepository.query("SELECT * FROM POSTS")).to.throw(Error);
    })));

    it("should return persisted objects using find* methods", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        const post1 = new Post();
        post1.title = "First Post";
        post1.text = "Everything about first post";
        await postRepository.save(post1);

        const post2 = new Post();
        post2.title = "Second Post";
        post2.text = "Everything about second post";
        await postRepository.save(post2);

        // save few posts
        const posts: Post[] = [];
        for (let i = 0; i < 50; i++) {
            const post = new Post();
            post.title = "Post #" + i;
            post.text = "Everything about post #" + i;
            posts.push(post);
        }
        await postRepository.save(posts);

        // assert.findOne method
        const loadedPost1 = await postRepository.findOne(post1.id);
        expect(loadedPost1!.id).to.be.eql(post1.id);
        expect(loadedPost1!.title).to.be.equal("First Post");
        expect(loadedPost1!.text).to.be.equal("Everything about first post");

        // assert findOne method
        const loadedPost2 = await postRepository.findOne({ title: "Second Post" });
        expect(loadedPost2!.id).to.be.eql(post2.id);
        expect(loadedPost2!.title).to.be.equal("Second Post");
        expect(loadedPost2!.text).to.be.equal("Everything about second post");

        // assert findByIds method
        const loadedPost3 = await postRepository.findByIds([
            post1.id,
            post2.id
        ]);
        expect(loadedPost3[0]!.id).to.be.eql(post1.id);
        expect(loadedPost3[0]!.title).to.be.equal("First Post");
        expect(loadedPost3[0]!.text).to.be.equal("Everything about first post");
        expect(loadedPost3[1].id).to.be.eql(post2.id);
        expect(loadedPost3[1].title).to.be.equal("Second Post");
        expect(loadedPost3[1].text).to.be.equal("Everything about second post");

        // assert find method
        const loadedPosts1 = await postRepository.find({
            skip: 10,
            take: 10
        });
        loadedPosts1.length.should.be.equal(10);
        expect(loadedPosts1[0]!.id).not.to.be.undefined;
        expect(loadedPosts1[0]!.title).not.to.be.undefined;
        expect(loadedPosts1[0]!.text).not.to.be.undefined;
        expect(loadedPosts1[9]!.id).not.to.be.undefined;
        expect(loadedPosts1[9]!.title).not.to.be.undefined;
        expect(loadedPosts1[9]!.text).not.to.be.undefined;

        // assert find method
        const [loadedPosts2, loadedPosts2Count] = await postRepository.findAndCount({
            skip: 5,
            take: 5
        });
        loadedPosts2.length.should.be.equal(5);
        loadedPosts2Count.should.be.equal(52);
        expect(loadedPosts2[0]!.id).not.to.be.undefined;
        expect(loadedPosts2[0]!.title).not.to.be.undefined;
        expect(loadedPosts2[0]!.text).not.to.be.undefined;
        expect(loadedPosts2[4]!.id).not.to.be.undefined;
        expect(loadedPosts2[4]!.title).not.to.be.undefined;
        expect(loadedPosts2[4]!.text).not.to.be.undefined;

    })));

    it("should sort entities in a query", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save few posts
        const posts: Post[] = [];
        for (let i = 0; i < 10; i++) {
            const post = new Post();
            post.title = "Post #" + i;
            post.text = "Everything about post #" + i;
            post.index = i;
            posts.push(post);
        }
        await postRepository.save(posts);



        // ASCENDANT SORTING
        let queryPostsAsc = await postRepository.find({
            order: { index: "ASC" }
        });


        queryPostsAsc.length.should.be.equal(10);
        for (let i = 0; i < 10; i++) {
            expect(queryPostsAsc[i]!.index).eq(i);
        }

        // DESCENDANT SORTING
        let queryPostsDesc = await postRepository.find({
            order: { index: "DESC" }
        });

        queryPostsDesc.length.should.be.equal(10);
        for (let j = 0; j < 10; j++) {
            expect(queryPostsDesc[j]!.index).eq(9 - j);
        }

    })));

    it("clear should remove all persisted entities", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save few posts
        const posts: Post[] = [];
        for (let i = 0; i < 50; i++) {
            const post = new Post();
            post.title = "Post #" + i;
            post.text = "Everything about post #" + i;
            posts.push(post);
        }
        await postRepository.save(posts);

        const [loadedPosts, postsCount] = await postRepository.findAndCount();
        expect(postsCount).to.be.equal(50);
        loadedPosts.length.should.be.equal(50);

        await postRepository.clear();

        const [loadedPostsAfterClear, postsCountAfterClear] = await postRepository.findAndCount();
        expect(postsCountAfterClear).to.be.equal(0);
        loadedPostsAfterClear.should.be.eql([]);
    })));

    it("remove should remove given entity", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        const post1 = new Post();
        post1.title = "First Post";
        post1.text = "Everything about first post";
        await postRepository.save(post1);

        const post2 = new Post();
        post2.title = "Second Post";
        post2.text = "Everything about second post";
        await postRepository.save(post2);

        const loadedPost1 = await postRepository.findOne(post1.id);
        await postRepository.remove(loadedPost1!);
        await postRepository.remove(post2);

        const [loadedPostsAfterClear, postsCountAfterClear] = await postRepository.findAndCount();
        expect(postsCountAfterClear).to.be.equal(0);
        loadedPostsAfterClear.should.be.eql([]);
    })));

    it("clear should remove all persisted entities", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save few posts
        const posts: Post[] = [];
        for (let i = 0; i < 50; i++) {
            const post = new Post();
            post.title = "Post #" + i;
            post.text = "Everything about post #" + i;
            posts.push(post);
        }
        await postRepository.save(posts);

        const [loadedPosts, postsCount] = await postRepository.findAndCount();
        expect(postsCount).to.be.equal(50);
        loadedPosts.length.should.be.equal(50);

        await postRepository.clear();

        const [loadedPostsAfterClear, postsCountAfterClear] = await postRepository.findAndCount();
        expect(postsCountAfterClear).to.be.equal(0);
        loadedPostsAfterClear.should.be.eql([]);
    })));

    it("preload should pre-load given object", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save a post first
        const postToSave = new Post();
        postToSave.title = "First Post";
        postToSave.text = "Everything about first post";
        await postRepository.save(postToSave);

        // now preload a post with setting
        const post = await postRepository.preload({
            id: postToSave.id,
            title: "This is updated post"
        });
        // console.log(post);
        post!.should.be.instanceOf(Post);
        post!.id.should.be.equal(postToSave.id);
        post!.title.should.be.equal("This is updated post");
        post!.text.should.be.equal("Everything about first post");
    })));

});

runIfMain(import.meta);
