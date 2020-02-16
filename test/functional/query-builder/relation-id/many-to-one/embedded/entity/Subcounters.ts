import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {User} from "./User.ts";

export class Subcounters {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: Number })
    version: number;

    @Column({ type: Number })
    watches: number;

    @ManyToOne(type => User)
    watchedUser: User;

    watchedUserId: number;

}
