import {Entity} from "../../../../../src";
import {PrimaryGeneratedColumn} from "../../../../../src";
import {Column} from "../../../../../src";
import {VersionColumn} from "../../../../../src";

@Entity()
export class PostWithVersion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @VersionColumn()
    version: number;

}
