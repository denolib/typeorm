import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PostInformation} from "./PostInformation.ts";
import {Index} from "../../../../../src/decorator/Index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    @Index()
    title: string;

    @Column({ type: String })
    text: string;

    @Column(type => PostInformation, { prefix: "info" })
    information: PostInformation = new PostInformation();

}
