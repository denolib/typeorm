import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {ObjectIdColumn} from "../../../../src/decorator/columns/ObjectIdColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ObjectID} from "../../../../src/driver/mongodb/typings.ts";

@Entity()
export class User {

    @ObjectIdColumn()
    id!: ObjectID;

    @Column({ type: String })
    name!: string;

}
