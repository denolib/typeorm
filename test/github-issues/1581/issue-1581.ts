import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {User} from "./entity/User.ts";
import {Product} from "./entity/Product.ts";
import {DeliverySlot} from "./entity/DeliverySlot.ts";
import {Order} from "./entity/Order.ts";
import {OrderItem} from "./entity/OrderItem.ts";

describe.skip("github issues > #1581 Composite key breaks OneToMany relation", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [DeliverySlot, Order, OrderItem, Product, User],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("throws an error because there is no object id defined", () => Promise.all(connections.map(async connection => {

        const user1 = new User();
        user1.email = "user1@example.com";
        await connection.manager.save(user1);

        const product1 = new Product();
        product1.id = 1;
        product1.name = "Product 1";
        await connection.manager.save(product1);

        const product2 = new Product();
        product2.id = 3;
        product2.name = "Product 2";
        await connection.manager.save(product2);

        const slot1 = new DeliverySlot();
        slot1.name = "Slot 1";
        await connection.manager.save(slot1);

        const slot2 = new DeliverySlot();
        slot2.name = "Slot 2";
        await connection.manager.save(slot2);

        const order1 = new Order();
        order1.deliverySlot = slot1;
        order1.user = user1;
        order1.enabled = true;
        await connection.manager.save(order1);

        const item1 = new OrderItem();
        item1.order = order1;
        item1.product = product1;
        item1.amount = 3;
        await connection.manager.save(item1);

        await connection.manager
            .createQueryBuilder(Order, "order")
            .leftJoinAndSelect("order.deliverySlot", "deliverySlot")
            .leftJoinAndSelect("order.user", "user")
            .leftJoinAndSelect("order.items", "items")
            .getMany();

        // const orders = await connection.manager.getRepository(RecurringOrder).find({ relations: ["items"] });
        // console.log(orders);
    })));

});

runIfMain(import.meta);
