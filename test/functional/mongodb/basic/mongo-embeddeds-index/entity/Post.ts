import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ObjectIdColumn} from "../../../../../../src/decorator/columns/ObjectIdColumn.ts";
import {Index} from "../../../../../../src/decorator/Index.ts";
import {ObjectID} from "../../../../../../src/driver/mongodb/typings.ts";
import {Information} from "./Information.ts";

@Entity()
@Index("info_description", ["info.description"])
export class Post {

    @ObjectIdColumn()
    id!: ObjectID;

    @Column({ type: String })
    title!: string;

    @Column({ type: String })
    name!: string;

    @Column(() => Information)
    info!: Information;

}
