import { Entity, PrimaryColumn, Column } from "../../../../src/index.ts";


@Entity()
export class Item {
    @PrimaryColumn({ type: Number })
    itemId!: number;

    @Column({ type: Number })
    planId!: number;
}
