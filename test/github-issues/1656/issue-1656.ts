import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Controller} from "./controller/Controller.ts";
import {A} from "./entity/A.ts";
import {B} from "./entity/B.ts";
import {C} from "./entity/C.ts";

// TODO(uki00a) This suite is skipped because we don't currently support `@TransactionRepository`.
describe.skip("github issues > #1656 Wrong repository order with multiple TransactionRepository inside a Transaction decorator", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [A, B, C],
        enabledDrivers: ["mysql"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should set TransactionRepository arguments in order", () => Promise.all(connections.map(async connection => {
        const [a, b, c] = await new Controller().t(new A(), new B(), new C());
        expect(a).to.be.eq("a");
        expect(b).to.be.eq("b");
        expect(c).to.be.eq("c");
    })));

    // you can add additional tests if needed

});

runIfMain(import.meta);
