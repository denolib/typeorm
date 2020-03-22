import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";
import {JoinColumn} from "../../../../../../../src/decorator/relations/JoinColumn.ts";
import {OneToMany} from "../../../../../../../src/decorator/relations/OneToMany.ts";
import {Category} from "./Category.ts";
import {PostCategory} from "./PostCategory.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @ManyToOne(type => Category)
    @JoinColumn({ referencedColumnName: "name" })
    categoryByName!: Category;

    @ManyToOne(type => Category)
    @JoinColumn()
    category!: Category;

    @OneToMany(type => PostCategory, postCategoryRelation => postCategoryRelation.post)
    categories!: PostCategory[];

    categoryId!: number;

    categoryName!: string;

}
