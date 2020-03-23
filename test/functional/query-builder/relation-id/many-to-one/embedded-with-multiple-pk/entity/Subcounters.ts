import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {User} from "./User.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";

export class Subcounters {

    @PrimaryColumn({ type: Number })
    version!: number;

    @Column({ type: Number })
    watches!: number;

    @ManyToOne(type => User)
    watchedUser!: User;

    watchedUserId!: number;

}
