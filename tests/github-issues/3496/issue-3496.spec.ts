import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";
import {Post} from "./entity/Post";
import {PromiseUtils} from "../../../src";

describe("github issues > #3496 jsonb comparison doesn't work", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["postgres"],
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("the entity should not be updated a second time", () => PromiseUtils.runInSequence(connections, async connection => {
        await connection.synchronize();
        const repository = connection.getRepository(Post);

        const problems = [{"message": "", "attributeKey": "", "level": ""}];
        const post = new Post();
        post.problems = problems.slice();

        const savedPost1 = await repository.save(post);
        const savedPost2 = await repository.save(
            repository.create({
                id: savedPost1.id,
                version: savedPost1.version,
                problems: problems.slice()
            })
        );

        expect(savedPost1!.version).toEqual(savedPost2!.version);
    }));
});
