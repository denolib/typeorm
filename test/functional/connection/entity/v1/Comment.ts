import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";
import {Index} from "../../../../../src/decorator/Index.ts";
import {Guest} from "./Guest.ts";

@Entity()
@Index("author_and_title_unique", ["author", "title"], { unique: true })
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    @Index()
    title: string;

    @Column({ type: String })
    context: string;

    @OneToMany(type => Comment, comment => comment.relay)
    reference?: Comment;

    @ManyToOne(type => Comment, comment => comment.reference)
    relay?: Comment;

    @ManyToOne(type => Guest, guest => guest.comments)
    author: Guest;
}
