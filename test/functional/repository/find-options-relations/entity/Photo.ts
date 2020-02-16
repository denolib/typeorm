import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/index.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {Post} from "./Post.ts";
import {Counters} from "./Counters.ts";
import {User} from "./User.ts";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    filename: string;

    @ManyToOne(type => User)
    user: User;

    @ManyToOne(type => Post, post => post.photos)
    post: Post;

    @Column(type => Counters)
    counters: Counters;

}
