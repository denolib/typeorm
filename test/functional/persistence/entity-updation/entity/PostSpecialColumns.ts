import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {CreateDateColumn} from "../../../../../src/decorator/columns/CreateDateColumn.ts";
import {UpdateDateColumn} from "../../../../../src/decorator/columns/UpdateDateColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {VersionColumn} from "../../../../../src/decorator/columns/VersionColumn.ts";

@Entity()
export class PostSpecialColumns {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @VersionColumn({ type: Number })
    version: number;

}
