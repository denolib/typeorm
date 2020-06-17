import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { Dummy } from "./entity/dummy.ts";
import { Dummy2 } from "./entity/dummy2.ts";

describe("github issues > #2364 should generate id value if @Column generated:true is set", () => {

    let connections: Connection[];

    it("should generate id value", async () => {
        connections = await createTestingConnections({
            entities: [Dummy, Dummy2],
            schemaCreate: true,
            dropSchema: true,
        });
        await reloadTestingDatabases(connections);
        await Promise.all(connections.map(async connection => {
            const repository1 = connection.getRepository(Dummy);
            const repository2 = connection.getRepository(Dummy2);
            let dummyObj1 = new Dummy();
            let dummyObj2 = new Dummy2();
            await repository1.insert(dummyObj1);
            await repository2.insert(dummyObj2);

            expect(dummyObj1.id).to.not.be.eq(0);
            expect(dummyObj2.id).to.not.be.eq(0);
        }));
        await closeTestingConnections(connections);
    });
});

runIfMain(import.meta);
