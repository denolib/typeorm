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

    @Column(type => Counters)
    counters!: Counters[];

    @Column({ type: String, array: true })
    names!: string[];

    @Column({ type: Number, array: true })
    numbers!: number[];

    @Column({ type: Boolean, array: true })
    booleans!: boolean[];

    @Column(type => Counters)
    other1!: Counters[];

    @Column(type => Counters)
    other2!: Counters[];

}
