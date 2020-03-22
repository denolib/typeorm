import { Entity } from "../../../../../src/decorator/entity/Entity.ts";
import { Column } from "../../../../../src/decorator/columns/Column.ts";
import { PrimaryGeneratedColumn } from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import { SimpleCounters } from "./SimpleCounters.ts";

@Entity()
export class SimplePost {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({ type: String })
    text!: string;

    @Column(type => SimpleCounters)
    counters!: SimpleCounters;
}
