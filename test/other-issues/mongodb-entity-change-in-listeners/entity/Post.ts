import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {BeforeUpdate} from "../../../../src/decorator/listeners/BeforeUpdate.ts";
import {UpdateDateColumn} from "../../../../src/decorator/columns/UpdateDateColumn.ts";
import {AfterLoad, ObjectIdColumn} from "../../../../src/index.ts";

@Entity()
export class Post {

    @ObjectIdColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({type: Boolean, default: false})
    active!: boolean;

    @UpdateDateColumn()
    updateDate!: Date;

    @BeforeUpdate()
    async beforeUpdate() {
        this.title += "!";
    }

    loaded: Boolean = false;

    @AfterLoad()
    async afterLoad() {
        this.loaded = true;
    }

}
