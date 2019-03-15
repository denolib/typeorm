import "reflect-metadata";
import {Connection} from "../../../../../src";
import {Post} from "./entity/Post";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";

describe("mongodb > basic repository actions", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("create should create instance of same entity", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        expect(postRepository.create()).toBeInstanceOf(Post);
    })));

    test("create should be able to fill data from the given object", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = postRepository.create({
            title: "This is created post",
            text: "All about this post"
        });
        expect(post).toBeInstanceOf(Post);
        expect(post.title).toEqual("This is created post");
        expect(post.text).toEqual("All about this post");
    })));

    test("merge should merge all given partial objects into given source entity", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = postRepository.create({
            title: "This is created post",
            text: "All about this post"
        });
        const mergedPost = postRepository.merge(post,
            { title: "This is updated post" },
            { text: "And its text is updated as well" }
        );
        expect(mergedPost).toBeInstanceOf(Post);
        expect(mergedPost).toEqual(post);
        expect(mergedPost.title).toEqual("This is updated post");
        expect(mergedPost.text).toEqual("And its text is updated as well");
    })));

    test("target should be valid", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        expect(postRepository.target).toBeDefined();
        expect(postRepository.target).toEqual(Post);
    })));

    test("should persist entity successfully and after persistence have generated object id", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = new Post();
        post.title = "Post #1";
        post.text = "Everything about post!";
        await postRepository.save(post);

        expect(post.id).toBeDefined();
    })));

    test("hasId should return true if id really has an id", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = new Post();
        post.title = "Post #1";
        post.text = "Everything about post!";
        await postRepository.save(post);

        expect(post.id).toBeDefined();
        postRepository.hasId(post).should.be.true;
    })));

    test("unsupported methods should throw exception", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        expect(() => postRepository.createQueryBuilder("post")).toThrow(Error);
        expect(() => postRepository.query("SELECT * FROM POSTS")).toThrow(Error);
    })));

    test("should return persisted objects using find* methods", () => Promise.all(connections.map(async connection => {
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
        expect(loadedPost1!.id).toEqual(post1.id);
        expect(loadedPost1!.title).toEqual("First Post");
        expect(loadedPost1!.text).toEqual("Everything about first post");

        // assert findOne method
        const loadedPost2 = await postRepository.findOne({ title: "Second Post" });
        expect(loadedPost2!.id).toEqual(post2.id);
        expect(loadedPost2!.title).toEqual("Second Post");
        expect(loadedPost2!.text).toEqual("Everything about second post");

        // assert findByIds method
        const loadedPost3 = await postRepository.findByIds([
            post1.id,
            post2.id
        ]);
        expect(loadedPost3[0]!.id).toEqual(post1.id);
        expect(loadedPost3[0]!.title).toEqual("First Post");
        expect(loadedPost3[0]!.text).toEqual("Everything about first post");
        expect(loadedPost3[1].id).toEqual(post2.id);
        expect(loadedPost3[1].title).toEqual("Second Post");
        expect(loadedPost3[1].text).toEqual("Everything about second post");

        // assert find method
        const loadedPosts1 = await postRepository.find({
            skip: 10,
            take: 10
        });
        expect(loadedPosts1.length).toEqual(10);
        expect(loadedPosts1[0]!.id).toBeDefined();
        expect(loadedPosts1[0]!.title).toBeDefined();
        expect(loadedPosts1[0]!.text).toBeDefined();
        expect(loadedPosts1[9]!.id).toBeDefined();
        expect(loadedPosts1[9]!.title).toBeDefined();
        expect(loadedPosts1[9]!.text).toBeDefined();

        // assert find method
        const [loadedPosts2, loadedPosts2Count] = await postRepository.findAndCount({
            skip: 5,
            take: 5
        });
        expect(loadedPosts2.length).toEqual(5);
        expect(loadedPosts2Count).toEqual(52);
        expect(loadedPosts2[0]!.id).toBeDefined();
        expect(loadedPosts2[0]!.title).toBeDefined();
        expect(loadedPosts2[0]!.text).toBeDefined();
        expect(loadedPosts2[4]!.id).toBeDefined();
        expect(loadedPosts2[4]!.title).toBeDefined();
        expect(loadedPosts2[4]!.text).toBeDefined();

    })));

    test("should sort entities in a query", () => Promise.all(connections.map(async connection => {
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


        expect(queryPostsAsc.length).toEqual(10);

        for (let i = 0; i < 10; i++) {
            expect(queryPostsAsc[i]!.index).toEqual(i);
        }

        // DESCENDANT SORTING
        let queryPostsDesc = await postRepository.find({
            order: { index: "DESC" }
        });

        expect(queryPostsDesc.length).toEqual(10);

        for (let j = 0; j < 10; j++) {
            expect(queryPostsDesc[j]!.index).toEqual(9 - j);
        }

    })));

    test("clear should remove all persisted entities", () => Promise.all(connections.map(async connection => {
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
        expect(postsCount).toEqual(50);
        expect(loadedPosts.length).toEqual(50);

        await postRepository.clear();

        const [loadedPostsAfterClear, postsCountAfterClear] = await postRepository.findAndCount();
        expect(postsCountAfterClear).toEqual(0);
        loadedPostsAfterClear.should.be.eql([]);
    })));

    test("remove should remove given entity", () => Promise.all(connections.map(async connection => {
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
        expect(postsCountAfterClear).toEqual(0);
        loadedPostsAfterClear.should.be.eql([]);
    })));

    test("clear should remove all persisted entities", () => Promise.all(connections.map(async connection => {
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
        expect(postsCount).toEqual(50);
        expect(loadedPosts.length).toEqual(50);

        await postRepository.clear();

        const [loadedPostsAfterClear, postsCountAfterClear] = await postRepository.findAndCount();
        expect(postsCountAfterClear).toEqual(0);
        loadedPostsAfterClear.should.be.eql([]);
    })));

    test("preload should pre-load given object", () => Promise.all(connections.map(async connection => {
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
        expect(post)!.toBeInstanceOf(Post);
        expect(post!.id).toEqual(postToSave.id);
        expect(post!.title).toEqual("This is updated post");
        expect(post!.text).toEqual("Everything about first post");
    })));

});
