import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/index.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";
import {PromiseUtils} from "../../../src/index.ts";

describe("github issues > #3496 jsonb comparison doesn't work", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Post],
            enabledDrivers: ["postgres"],
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("the entity should not be updated a second time", () => PromiseUtils.runInSequence(connections, async connection => {
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

        savedPost1!.version.should.be.equal(savedPost2!.version);
    }));
});

runIfMain(import.meta);
