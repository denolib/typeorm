import { Entity } from "../../../../../../src/decorator/entity/Entity.ts";
import { Column } from "../../../../../../src/decorator/columns/Column.ts";
import { ObjectIdColumn } from "../../../../../../src/decorator/columns/ObjectIdColumn.ts";
import { ObjectID } from "../../../../../../src/driver/mongodb/typings.ts";
import { CreateDateColumn } from "../../../../../../src/decorator/columns/CreateDateColumn.ts";
import { UpdateDateColumn } from "../../../../../../src/decorator/columns/UpdateDateColumn.ts";

@Entity()
export class Post {

    @ObjectIdColumn()
    id!: ObjectID;

    @Column({ type: String })
    message!: string;

    @Column({ type!: Date })
    @CreateDateColumn()
    createdAt!: Date;

    @Column({ type!: Date })
    @UpdateDateColumn()
    updatedAt!: Date;
}
