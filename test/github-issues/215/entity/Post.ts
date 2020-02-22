import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Author} from "./Author.ts";
import {Abbreviation} from "./Abbreviation.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => Author)
    @JoinColumn({name: "author_id"})
    author: Author;

    @OneToOne(type => Abbreviation)
    @JoinColumn({name: "abbreviation_id"})
    abbreviation: Abbreviation;

}
