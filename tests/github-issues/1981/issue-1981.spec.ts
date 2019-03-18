import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Product} from "./entity/Product";

describe("github issues > #1981 Boolean values not casted properly when used in .find() condition", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["sqlite"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should be able to find by boolean find", () => Promise.all(connections.map(async connection => {
        const product = new Product();
        product.liked = true;
        await connection.manager.save(product);

        const loadedProduct = await connection.manager.findOne(Product, { liked: true });
        expect(loadedProduct!.liked).toEqual(true);
    })));

});
