import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Product} from "./entity/Product";

describe("github issues > #752 postgres - count query fails for empty table", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should return user by a given email and proper escape 'user' keyword", () => Promise.all(connections.map(async connection => {

        const product = new Product();
        product.name = "Apple";
        product.productVersionId = 1;
        await connection.manager.save(product);

        const count = await connection.getRepository(Product).count({ productVersionId: 1 });
        expect(count).toEqual(1);
    })));

});
