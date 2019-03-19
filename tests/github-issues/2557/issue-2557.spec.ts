import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Dummy} from "./entity/dummy";
import {transformer, WrappedNumber} from "./transformer";

describe("github issues > #2557 object looses its prototype before transformer.to()", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should give correct object in transformer.to", () => Promise.all(connections.map(async connection => {
        const dummy = new Dummy();
        dummy.id = 1;
        dummy.num = new WrappedNumber(3);

        await connection.getRepository(Dummy).save(dummy);

        expect(transformer.lastValue).toBeInstanceOf(WrappedNumber);
    })));

    // you can add additional tests if needed

});
