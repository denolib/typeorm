import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ObjectIdColumn} from "../../../../../../src/decorator/columns/ObjectIdColumn.ts";
import {Counters} from "./Counters.ts";
import {ObjectID} from "../../../../../../src/driver/mongodb/typings.ts";

@Entity()
export class Post {

    @ObjectIdColumn()
    id!: ObjectID;

    @Column({ type: String })
    title!: string;

    @Column({ type: String })
    text!: string;

    @Column(type => Counters)
    counters?: Counters;

}
