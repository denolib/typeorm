import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {VersionColumn} from "../../../../../src/decorator/columns/VersionColumn.ts";
import {UpdateDateColumn} from "../../../../../src/decorator/columns/UpdateDateColumn.ts";

@Entity("post_with_v_ud")
export class PostWithVersionAndUpdatedDate {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @VersionColumn()
    version!: number;

    @UpdateDateColumn()
    updateDate!: Date;

}
