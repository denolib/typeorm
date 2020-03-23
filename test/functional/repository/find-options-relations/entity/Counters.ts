import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {User} from "./User.ts";

export class Counters {

    @Column({ type: Number })
    stars!: number;

    @Column({ type: Number })
    commentCount!: number;

    @ManyToOne(type => User)
    author!: User;

}
