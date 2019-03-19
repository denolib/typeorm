import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {User} from "./entity/User";
import {PromiseUtils} from "../../../src";

describe("github issues > #3422 cannot save to nested-tree table if schema is used in postgres", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["postgres"],
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should not fail when using schema and nested-tree", () => PromiseUtils.runInSequence(connections, async connection => {
        await connection.query("CREATE SCHEMA IF NOT EXISTS admin");
        await connection.synchronize();
        const parent = new User();
        await connection.manager.save(parent);
        const child = new User();
        child.manager = parent;
        await connection.manager.save(child);

        const user = await connection.manager.getRepository(User).findOne(child.id, {relations: ["manager"]});
        expect(user!.id).toEqual(child.id);
        expect(user!.manager.id).toEqual(parent.id);
    }));
});
