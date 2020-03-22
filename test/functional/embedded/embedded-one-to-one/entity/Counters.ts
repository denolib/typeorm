import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {User} from "./User.ts";
import {Subcounters} from "./Subcounters.ts";

export class Counters {

    @Column({ type: Number })
    code!: number;

    @Column({ type: Number })
    likes!: number;

    @Column({ type: Number })
    comments!: number;

    @Column({ type: Number })
    favorites!: number;

    @Column(() => Subcounters, { prefix: "subcnt" })
    subcounters!: Subcounters;

    @OneToOne(() => User, user => user.likedPost)
    @JoinColumn()
    likedUser!: User;

}
