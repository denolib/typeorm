import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";
import {User} from "./User.ts";
import {Subcounters} from "./Subcounters.ts";

export class Counters {

    @Column({ type: Number })
    code: number;

    @Column({ type: Number })
    likes: number;

    @Column({ type: Number })
    comments: number;

    @Column({ type: Number })
    favorites: number;

    @Column(() => Subcounters, { prefix: "subcnt" })
    subcounters: Subcounters;

    @OneToMany(type => User, user => user.likedPost)
    likedUsers: User[];

}
