import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Counters} from "./Counters.ts";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    url: string;

    @Column(type => Counters)
    counters: Counters;

}
