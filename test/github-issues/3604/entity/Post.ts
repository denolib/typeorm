import {PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Entity} from "../../../../src/index.ts";
import {JoinColumn} from "../../../../src/index.ts";
import {ManyToOne} from "../../../../src/index.ts";
import {Author} from "./Author.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(type => Author)
    @JoinColumn()
    author: Author;
}
