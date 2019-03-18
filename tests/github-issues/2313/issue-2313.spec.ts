import "reflect-metadata";
import {Connection} from "../../../src";
import {PromiseUtils} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Post} from "./entity/Post";
import {EntityNotFoundError} from "../../../src/error/EntityNotFoundError";

describe("github issues > #2313 - BaseEntity has no findOneOrFail() method", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"]
    }));

    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should find the appropriate record when one exists", () => PromiseUtils.runInSequence(connections, async connection => {
        Post.useConnection(connection); // change connection each time because of AR specifics

        const post1 = new Post();
        post1.data = 123;
        await post1.save();

        const post2 = new Post();
        post2.data = 456;
        await post2.save();

        const result1 = await Post.findOneOrFail(1);
        expect(result1.data).toEqual(123);
        const result2 = await Post.findOneOrFail(2);
        expect(result2.data).toEqual(456);
    }));

    test("should throw no matching record exists", () => PromiseUtils.runInSequence(connections, async connection => {
        Post.useConnection(connection); // change connection each time because of AR specifics

        try {
            await Post.findOneOrFail(100);
            expect.fail();
        } catch (e) {
            expect(e).toBeInstanceOf(EntityNotFoundError);
        }
    }));

});
