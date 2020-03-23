import {Column, Entity, ManyToOne} from "../../../../src/index.ts";
import {Order} from "./Order.ts";
import {Product} from "./Product.ts";

@Entity()
export class OrderItem {

    @ManyToOne(type => Order, recurringOrder => recurringOrder.items, { primary: true })
    order!: Order;

    @ManyToOne(type => Product, { primary: true })
    product!: Product;

    @Column({ type: Number })
    amount!: number;

}
