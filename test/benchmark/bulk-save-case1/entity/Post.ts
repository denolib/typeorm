import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({ type: "text" })
    text!: string;

    @Column({ type: "int" })
    likesCount!: number;

    @Column({ type: "int" })
    commentsCount!: number;

    @Column({ type: "int" })
    watchesCount!: number;

}
