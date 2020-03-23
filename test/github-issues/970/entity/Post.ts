import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {ObjectIdColumn} from "../../../../src/decorator/columns/ObjectIdColumn.ts";
import {ObjectID} from "../../../../src/driver/mongodb/typings.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @ObjectIdColumn()
    id!: ObjectID;

    @Column({ type: String })
    title!: string;

    @Column({ type: String })
    text!: string;

}
