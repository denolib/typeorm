import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Index} from "../../../../src/decorator/Index.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {Tag} from "./Tag.ts";

@Index(["a", "b", "c", "tag"])
@Index(["b", "tag", "c"])
@Index(["c", "a"])
@Entity("Posts")
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    a: string;

    @Column({ type: String })
    b: string;

    @Column({ type: String })
    c: string;

    @ManyToOne(() => Tag)
    tag: Tag;
}
