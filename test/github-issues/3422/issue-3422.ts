import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {User} from "./entity/User.ts";
import {PromiseUtils} from "../../../src/index.ts";

describe("github issues > #3422 cannot save to nested-tree table if schema is used in postgres", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [User],
            enabledDrivers: ["postgres"],
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should not fail when using schema and nested-tree", () => PromiseUtils.runInSequence(connections, async connection => {
        await connection.query("CREATE SCHEMA IF NOT EXISTS admin");
        await connection.synchronize();
        const parent = new User();
        await connection.manager.save(parent);
        const child = new User();
        child.manager = parent;
        await connection.manager.save(child);

        const user = await connection.manager.getRepository(User).findOne(child.id, {relations: ["manager"]});
        user!.id.should.be.equal(child.id);
        user!.manager.id.should.be.equal(parent.id);
    }));
});

runIfMain(import.meta);
