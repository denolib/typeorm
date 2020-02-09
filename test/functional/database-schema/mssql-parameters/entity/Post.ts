import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {CreateDateColumn} from "../../../../../src/decorator/columns/CreateDateColumn.ts";
import {UpdateDateColumn} from "../../../../../src/decorator/columns/UpdateDateColumn.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    name: string;

    @Column({ type: String })
    category: string;

    @Column({ type: String })
    text: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

}
