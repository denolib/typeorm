import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {OneToMany} from "../../../../../../../src/decorator/relations/OneToMany.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {User} from "./User.ts";

export class Subcounters {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: Number })
    version!: number;

    @Column({ type: Number })
    watches!: number;

    @OneToMany(type => User, user => user.posts)
    watchedUsers!: User[];

    watchedUserIds!: number[];

}
