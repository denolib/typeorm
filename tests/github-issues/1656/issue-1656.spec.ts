import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Controller} from "./controller/Controller";
import {A} from "./entity/A";
import {B} from "./entity/B";
import {C} from "./entity/C";

describe("github issues > #1656 Wrong repository order with multiple TransactionRepository inside a Transaction decorator", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should set TransactionRepository arguments in order", () => Promise.all(connections.map(async connection => {
        const [a, b, c] = await new Controller().t(new A(), new B(), new C());
        expect(a).toEqual("a");
        expect(b).toEqual("b");
        expect(c).toEqual("c");
    })));

    // you can add additional tests if needed

});
