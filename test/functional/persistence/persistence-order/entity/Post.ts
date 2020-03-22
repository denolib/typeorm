import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";
import {Details} from "./Details.ts";
import {Photo} from "./Photo.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @OneToOne(type => Category, category => category.post, {
        nullable!: true
    })
    @JoinColumn()
    category!: Category;

    @OneToOne(type => Details, details => details.post, {
        nullable!: false
    })
    @JoinColumn()
    details!: Details;

    @OneToOne(type => Photo, photo => photo.post)
    photo!: Photo;

}
