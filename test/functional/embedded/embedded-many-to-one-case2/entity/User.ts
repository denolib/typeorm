import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";
import {Post} from "./Post.ts";

@Entity()
export class User {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    name: string;

    @ManyToOne(type => Post)
    @JoinColumn()
    likedPost: Post;

}
