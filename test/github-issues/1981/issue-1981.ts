import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/index.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Product} from "./entity/Product.ts";

describe("github issues > #1981 Boolean values not casted properly when used in .find() condition", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        enabledDrivers: ["sqlite"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should be able to find by boolean find", () => Promise.all(connections.map(async connection => {
        const product = new Product();
        product.liked = true;
        await connection.manager.save(product);

        const loadedProduct = await connection.manager.findOne(Product, { liked: true });
        loadedProduct!.liked.should.be.equal(true);
    })));

});

runIfMain(import.meta);
