import { Entity, PrimaryColumn, Column } from "../../../../src";


@Entity()
export class Item {
    @PrimaryColumn()
    itemId: number;

    @Column()
    planId: number;
}
