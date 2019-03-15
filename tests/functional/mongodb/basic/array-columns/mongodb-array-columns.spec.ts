import "reflect-metadata";
import {Connection} from "../../../../../src";
import {Post} from "./entity/Post";
import {Counters} from "./entity/Counters";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";

describe("mongodb > array columns", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post, Counters],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should insert / update array columns correctly", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save a post
        const post = new Post();
        post.title = "Post";
        post.names = ["umed", "dima", "bakhrom"];
        post.numbers = [1, 0, 1];
        post.booleans = [true, false, false];
        post.counters = [
            new Counters(1, "number #1"),
            new Counters(2, "number #2"),
            new Counters(3, "number #3"),
        ];
        post.other1 = [];
        await postRepository.save(post);

        // check saved post
        const loadedPost = await postRepository.findOne({ title: "Post" });

        expect(loadedPost).toBeDefined();
        expect(loadedPost!.names).toBeDefined();
        expect(loadedPost!.numbers).toBeDefined();
        expect(loadedPost!.booleans).toBeDefined();
        expect(loadedPost!.counters).toBeDefined();
        expect(loadedPost!.other1.length).toEqual(0);
        expect(loadedPost!.other2).toBeUndefined();

        expect(loadedPost!.names[0]).toEqual("umed");
        expect(loadedPost!.names[1]).toEqual("dima");
        expect(loadedPost!.names[2]).toEqual("bakhrom");

        expect(loadedPost!.numbers[0]).toEqual(1);
        expect(loadedPost!.numbers[1]).toEqual(0);
        expect(loadedPost!.numbers[2]).toEqual(1);

        expect(loadedPost!.booleans[0]).toEqual(true);
        expect(loadedPost!.booleans[1]).toEqual(false);
        expect(loadedPost!.booleans[2]).toEqual(false);

        expect(loadedPost!.counters[0]).toBeInstanceOf(Counters);
        expect(loadedPost!.counters[1]).toBeInstanceOf(Counters);
        expect(loadedPost!.counters[2]).toBeInstanceOf(Counters);

        expect(loadedPost!.counters[0].likes).toEqual(1);
        expect(loadedPost!.counters[1].likes).toEqual(2);
        expect(loadedPost!.counters[2].likes).toEqual(3);
        expect(loadedPost!.counters[0].text).toEqual("number #1");
        expect(loadedPost!.counters[1].text).toEqual("number #2");
        expect(loadedPost!.counters[2].text).toEqual("number #3");

        // now update the post
        post.names = ["umed!", "dima!", "bakhrom!"];
        post.numbers = [11, 10, 11];
        post.booleans = [true, true, true];
        post.counters = [
            new Counters(11, "number #11"),
            new Counters(12, "number #12"),
        ];
        post.other1 = [
            new Counters(0, "other"),
        ];
        await postRepository.save(post);

        // now load updated post
        const loadedUpdatedPost = await postRepository.findOne({ title: "Post" });

        expect(loadedUpdatedPost).toBeDefined();
        expect(loadedUpdatedPost!.names).toBeDefined();
        expect(loadedUpdatedPost!.numbers).toBeDefined();
        expect(loadedUpdatedPost!.booleans).toBeDefined();
        expect(loadedUpdatedPost!.counters).toBeDefined();
        expect(loadedUpdatedPost!.other1).toBeDefined();
        expect(loadedUpdatedPost!.other2).toBeUndefined();

        expect(loadedUpdatedPost!.names[0]).toEqual("umed!");
        expect(loadedUpdatedPost!.names[1]).toEqual("dima!");
        expect(loadedUpdatedPost!.names[2]).toEqual("bakhrom!");

        expect(loadedUpdatedPost!.numbers[0]).toEqual(11);
        expect(loadedUpdatedPost!.numbers[1]).toEqual(10);
        expect(loadedUpdatedPost!.numbers[2]).toEqual(11);

        expect(loadedUpdatedPost!.booleans[0]).toEqual(true);
        expect(loadedUpdatedPost!.booleans[1]).toEqual(true);
        expect(loadedUpdatedPost!.booleans[2]).toEqual(true);

        expect(loadedUpdatedPost!.counters[0]).toBeInstanceOf(Counters);
        expect(loadedUpdatedPost!.counters[1]).toBeInstanceOf(Counters);

        expect(loadedUpdatedPost!.counters[0].likes).toEqual(11);
        expect(loadedUpdatedPost!.counters[1].likes).toEqual(12);

        expect(loadedUpdatedPost!.counters[0].text).toEqual("number #11");
        expect(loadedUpdatedPost!.counters[1].text).toEqual("number #12");

        expect(loadedUpdatedPost!.other1[0]).toBeInstanceOf(Counters);
        expect(loadedUpdatedPost!.other1[0].likes).toEqual(0);
        expect(loadedUpdatedPost!.other1[0].text).toEqual("other");

    })));

});
