import {ObjectID} from "../../../../src/driver/mongodb/typings.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {ObjectIdColumn} from "../../../../src/decorator/columns/ObjectIdColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Event {

    @ObjectIdColumn()
    id!: ObjectID;

    @Column({ type: String })
    name!: string;

    @Column({ type: Date, name: "at_date", default: Date.now })
    date!: Date;

    // @Column( type => User)
    // participants!: User[]
}
