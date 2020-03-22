import {DeliverySlot} from "./DeliverySlot.ts";
import {User} from "./User.ts";
import {OrderItem} from "./OrderItem.ts";
import {Column, Entity, ManyToOne, OneToMany} from "../../../../src/index.ts";

@Entity()
export class Order {

    @ManyToOne(type => DeliverySlot, { primary: true })
    deliverySlot!: DeliverySlot;

    @ManyToOne(type => User, user => user.recurringOrders, { primary: true })
    user!: User;

    @Column({ type: Boolean })
    enabled!: boolean;

    @OneToMany(type => OrderItem, item => item.order)
    items!: OrderItem[];
}
