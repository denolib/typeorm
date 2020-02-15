import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {Category} from "./Category.ts";
import {Image} from "./Image.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../src/decorator/relations/JoinColumn.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @ManyToOne(type => Category)
    category: Category;

    @OneToOne(type => Image, image => image.post)
    @JoinColumn()
    image: Image;

}
