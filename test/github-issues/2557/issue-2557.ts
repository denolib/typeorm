import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Dummy} from "./entity/dummy.ts";
import {transformer, WrappedNumber} from "./transformer.ts";

describe("github issues > #2557 object looses its prototype before transformer.to()", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should give correct object in transformer.to", () => Promise.all(connections.map(async connection => {
        const dummy = new Dummy();
        dummy.id = 1;
        dummy.num = new WrappedNumber(3);

        await connection.getRepository(Dummy).save(dummy);

        expect(transformer.lastValue).to.be.instanceOf(WrappedNumber);
    })));

    // you can add additional tests if needed

});

runIfMain(import.meta);
