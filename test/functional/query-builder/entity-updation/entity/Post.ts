import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {CreateDateColumn} from "../../../../../src/decorator/columns/CreateDateColumn.ts";
import {UpdateDateColumn} from "../../../../../src/decorator/columns/UpdateDateColumn.ts";
import {VersionColumn} from "../../../../../src/decorator/columns/VersionColumn.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @CreateDateColumn()
    createDate!: string;

    @UpdateDateColumn()
    updateDate!: string;

    @Column({ default: 100, type: Number })
    order!: number;

    @VersionColumn()
    version!: number;

}
