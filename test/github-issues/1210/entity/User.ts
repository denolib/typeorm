import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {ObjectIdColumn} from "../../../../src/decorator/columns/ObjectIdColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ObjectID} from "../../../../src/driver/mongodb/typings.ts";
import {Event} from "./Event.ts";

@Entity()
export class User {

    @ObjectIdColumn()
    id!: ObjectID;

    @Column({ type: String })
    firstName!: string;

    @Column({ type: String })
    lastName!: string;

    @Column({ type: Number })
    age!: number;

    @Column(type => Event)
    events!: Event[];

}
