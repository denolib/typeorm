import "reflect-metadata";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {Connection} from "../../../src";

describe("github issues > #108 Error with constraint names on postgres", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchema: true,
    }));
    afterAll(() => closeTestingConnections(connections));

    test("should sync even when there unqiue constraints placed on similarly named columns", () => Promise.all(connections.map(async connection => {
       // By virtue that we got here means that it must have worked.
       expect(true).toBeTruthy();
    })));

});
