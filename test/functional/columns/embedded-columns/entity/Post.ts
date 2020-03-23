import { Entity } from "../../../../../src/decorator/entity/Entity.ts";
import { Column } from "../../../../../src/decorator/columns/Column.ts";
import { PrimaryGeneratedColumn } from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import { Counters } from "./Counters.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({ type: String })
    text!: string;

    @Column(type => Counters)
    counters!: Counters;

    @Column(type => Counters, { prefix: "testCounters" })
    otherCounters!: Counters;

    @Column(type => Counters, { prefix: "" })
    countersWithoutPrefix!: Counters;

}
