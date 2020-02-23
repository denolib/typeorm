import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {UpdateDateColumn} from "../../../../src/decorator/columns/UpdateDateColumn.ts";
import {/*ObjectID, */ObjectIdColumn} from "../../../../src/index.ts";

@Entity()
export class Post {

    @ObjectIdColumn({ type: String })
    id: any/*ObjectID*/; // TODO(uki00a) uncomment this when MongoDriver is implemented.

    @Column({ type: String })
    title: string;

    @Column({ type: Boolean })
    active: boolean = false;

    @UpdateDateColumn()
    updateDate: Date;

    @Column({ type: Number })
    updatedColumns: number|string[] = 0;

    loaded: boolean = false;
}
