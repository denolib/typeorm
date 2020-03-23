import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../../../src/decorator/relations/JoinTable.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {User} from "./User.ts";

export class Subcounters {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: Number })
    version!: number;

    @Column({ type: Number })
    watches!: number;

    @ManyToMany(type => User)
    @JoinTable({ name: "subcnt_users" })
    watchedUsers!: User[];

    watchedUserIds!: number[];

}
