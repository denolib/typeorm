import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Counters} from "./Counters.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column(() => Counters)
    counters!: Counters;

}
