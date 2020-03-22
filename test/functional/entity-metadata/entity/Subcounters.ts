import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";
import {User} from "./User.ts";

export class Subcounters {

    @Column({ type: Number })
    version!: number;

    @Column({ type: Number })
    watches!: number;

    @ManyToMany(type => User)
    @JoinTable({ name: "post_cnt_subcnt_wtch_users" })
    watchedUsers!: User[];

}
