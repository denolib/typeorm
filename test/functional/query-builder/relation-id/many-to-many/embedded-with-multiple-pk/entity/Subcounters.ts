import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../../../src/decorator/relations/JoinTable.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {User} from "./User.ts";

export class Subcounters {

    @PrimaryColumn({ type: Number })
    version: number;

    @Column({ type: Number })
    watches: number;

    @ManyToMany(type => User, user => user.posts)
    @JoinTable({ name: "subcnt_users" })
    watchedUsers: User[];

    watchedUserIds: number[];

}
