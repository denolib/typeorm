import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Post} from "./Post.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";

@Entity()
export class User {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToOne(() => Post, post => post.counters.likedUser)
    likedPost!: Post;

}
