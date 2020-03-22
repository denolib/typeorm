import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {User} from "./User.ts";
import {Subcounters} from "./Subcounters.ts";

export class Counters {

    @PrimaryColumn({ type: Number })
    code!: number;

    @Column({ type: Number })
    likes!: number;

    @Column({ type: Number })
    comments!: number;

    @Column({ type: Number })
    favorites!: number;

    @Column(() => Subcounters, { prefix: "subcnt" })
    subcounters!: Subcounters;

    @ManyToOne(type => User)
    @JoinColumn()
    likedUser!: User;

}
