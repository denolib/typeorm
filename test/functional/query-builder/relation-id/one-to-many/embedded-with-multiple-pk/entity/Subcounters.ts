import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {OneToMany} from "../../../../../../../src/decorator/relations/OneToMany.ts";
import {User} from "./User.ts";

export class Subcounters {

    @PrimaryColumn({ type: Number })
    version: number;

    @Column({ type: Number })
    watches: number;

    @OneToMany(type => User, user => user.post)
    watchedUsers: User[];

    watchedUserIds: number[];

}
