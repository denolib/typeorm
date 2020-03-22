import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {BeforeUpdate} from "../../../../src/decorator/listeners/BeforeUpdate.ts";
import {UpdateDateColumn} from "../../../../src/decorator/columns/UpdateDateColumn.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({ type: Boolean, default: false })
    active!: boolean;

    //@UpdateDateColumn()
    //updateDate: Date;

    @BeforeUpdate()
    beforeUpdate() {
        this.title += "!";
    }

}
