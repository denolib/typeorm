import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Product} from "./entity/Product.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";


describe("github issues > #1929 Select attributes in Find method - mongodb", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Product],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("return column on include in select on find",
        () => Promise.all(connections.map(async connection => {
            const productRepository = connection.getMongoRepository(Product);
            let product = new Product("test1", "label1", 10);
            await productRepository.save(product);
            product = new Product("test2", "label2", 20);
            await productRepository.save(product);
            product = new Product("test3", "label3", 30);
            await productRepository.save(product);
            await productRepository.find({select: ["name", "label"], order: {name: 1}});
        })));

    it("return column on include in select on findAndCount",
        () => Promise.all(connections.map(async connection => {
            const productRepository = connection.getMongoRepository(Product);
            let product = new Product("test1", "label1", 10);
            await productRepository.save(product);
            product = new Product("test2", "label2", 20);
            await productRepository.save(product);
            product = new Product("test3", "label3", 30);
            await productRepository.save(product);
            await productRepository.findAndCount({select: ["name", "label"], order: {name: 1}});
        })));

    it("return column on include in select on findByIds",
        () => Promise.all(connections.map(async connection => {
            const productRepository = connection.getMongoRepository(Product);
            let product = new Product("test1", "label1", 10);
            await productRepository.save(product);
            product = new Product("test2", "label2", 20);
            await productRepository.save(product);
            product = new Product("test3", "label3", 30);
            const product3 = await productRepository.save(product);
            await productRepository.findByIds([product3.id], {select: ["name", "label"], order: {name: 1}});
        })));

    it("return column on include in select on findByIds ",
        () => Promise.all(connections.map(async connection => {
            const productRepository = connection.getMongoRepository(Product);
            let product = new Product("test1", "label1", 10);
            await productRepository.save(product);
            product = new Product("test2", "label2", 20);
            await productRepository.save(product);
            product = new Product("test3", "label3", 30);
            await productRepository.findOne({where: {name: "test2"}, select: ["name", "label"], order: {name: 1}});
        })));

});

runIfMain(import.meta);
