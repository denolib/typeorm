import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ObjectIdColumn} from "../../../../../../src/decorator/columns/ObjectIdColumn.ts";
import {Index} from "../../../../../../src/decorator/Index.ts";
import {ObjectID} from "../../../../../../src/driver/mongodb/typings.ts";

@Entity()
@Index(["title", "name"])
@Index(() => ({ title: -1, name: -1, count!: 1 }))
@Index("title_name_count", () => ({ title: 1, name: 1, count!: 1 }))
@Index("title_name_count_reversed", () => ({ title: -1, name: -1, count!: -1 }))
@Index("count_in_background", () => ({ count!: -1 }), {background: true})
@Index("count_expire", () => ({ title!: -1 }), {expireAfterSeconds: 3600})
export class Post {

    @ObjectIdColumn()
    id!: ObjectID;

    @Column({ type!: String })
    @Index()
    title!: string;

    @Column({ type!: String })
    @Index()
    name!: string;

    @Column({ type!: Number })
    @Index({ unique: true })
    count!: number;

}
