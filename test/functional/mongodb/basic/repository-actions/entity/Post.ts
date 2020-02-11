import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ObjectIdColumn} from "../../../../../../src/decorator/columns/ObjectIdColumn.ts";
import {ObjectID} from "../../../../../../src/driver/mongodb/typings.ts";

@Entity()
export class Post {

    @ObjectIdColumn()
    id: ObjectID;

    @Column({ type: String })
    title: string;

    @Column({ type: String })
    text: string;

    @Column({ type: Number })
    index: number;

    // @Column(() => Counters)
    // counters: Counters;

}
