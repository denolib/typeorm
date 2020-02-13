import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {OneToOne} from "../../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../../src/decorator/relations/JoinColumn.ts";
import {User} from "./User.ts";

export class Subcounters {

    @PrimaryColumn({ type: Number })
    version: number;

    @Column({ type: Number })
    watches: number;

    @OneToOne(type => User)
    @JoinColumn()
    watchedUser: User;

    watchedUserId: number;

}
