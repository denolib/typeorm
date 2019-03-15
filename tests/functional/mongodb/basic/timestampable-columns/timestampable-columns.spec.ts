import "reflect-metadata";
import {Connection} from "../../../../../src";
import {Post} from "./entity/Post";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";

describe("mongodb > timestampable columns", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should persist timestampable columns", () => Promise.all(connections.map(async connection => {
        const commentMongoRepository = connection.getMongoRepository(Post);

        // save a post
        const post = new Post();
        post.message = "Hello";
        await commentMongoRepository.save(post);
        expect(post.id).toBeDefined();
        post.createdAt.should.be.instanceof(Date);
        const createdAt = post.createdAt;

        post.updatedAt.should.be.instanceof(Date);
        const updatedAt = post.updatedAt;

        expect(post.createdAt.getTime()).toEqual(post.updatedAt.getTime());

        // update
        const date = new Date();
        date.setFullYear(2001);

        post.message = "New message";
        post.createdAt = date;
        post.updatedAt = date;

        await commentMongoRepository.save(post);

        const updatedPost = await commentMongoRepository.findOne(post.id);

        expect(updatedPost).toBeDefined();

        expect((updatedPost as Post).createdAt.getTime()).toEqual(createdAt.getTime());
        expect((updatedPost as Post).updatedAt.getTime()).toEqual(updatedAt.getTime());
    })));

});

