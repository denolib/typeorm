import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Order} from "./Order.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String, unique: true })
    email: string;

    @OneToMany(type => Order, recurringOrder => recurringOrder.user)
    recurringOrders: Order[];

}
