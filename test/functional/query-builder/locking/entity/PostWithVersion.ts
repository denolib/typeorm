import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {VersionColumn} from "../../../../../src/decorator/columns/VersionColumn.ts";

@Entity()
export class PostWithVersion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @VersionColumn()
    version: number;

}
