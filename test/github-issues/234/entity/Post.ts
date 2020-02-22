import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";
import {Tag} from "./Tag.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @ManyToOne(() => Category, category => category.posts, {
        cascade: ["insert"]
    })
    category: Promise<Category>;

    @ManyToMany(type => Tag, tag => tag.posts, {
        cascade: ["insert"]
    })
    @JoinTable()
    tags: Promise<Tag[]>;

}
