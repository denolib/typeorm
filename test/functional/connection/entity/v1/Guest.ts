import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";
import {Comment} from "./Comment.ts";

@Entity()
export class Guest {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    username: string;

    @OneToMany(type => Comment, comment => comment.author)
    comments: Comment[];
}
