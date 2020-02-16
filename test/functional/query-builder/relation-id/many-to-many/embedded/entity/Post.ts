import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {Counters} from "./Counters.ts";

@Entity()
export class Post {

    @Column({ type: String })
    title: string;

    @Column(() => Counters, { prefix: "cnt" })
    counters: Counters;

}
