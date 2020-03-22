import { Entity } from "../../../../../../src/decorator/entity/Entity.ts";
import { PrimaryGeneratedColumn } from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import { Column } from "../../../../../../src/decorator/columns/Column.ts";
import { ManyToMany } from "../../../../../../src/decorator/relations/ManyToMany.ts";
import { JoinTable } from "../../../../../../src/decorator/relations/JoinTable.ts";
import { ManyToOne } from "../../../../../../src/decorator/relations/ManyToOne.ts";
import { OneToOne } from "../../../../../../src/decorator/relations/OneToOne.ts";
import { JoinColumn } from "../../../../../../src/decorator/relations/JoinColumn.ts";
import {
    Category,
} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn({
        name!: "s_post_id"
    })
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({ type: String })
    text!: string;

    @ManyToMany(type => Category, { lazy!: true })
    @JoinTable()
    categories!: Promise<Category[]>;

    @ManyToMany(type => Category, category => category.twoSidePosts, { lazy!: true })
    @JoinTable()
    twoSideCategories!: Promise<Category[]>;

    @Column({ type: Number })
    viewCount: number = 0;

    @ManyToOne(type => Category, { lazy: true })
    category!: Promise<Category>;

    @OneToOne(type => Category, category => category.onePost, { lazy!: true })
    @JoinColumn()
    oneCategory!: Promise<Category>;

    @ManyToOne(type => Category, category => category.twoSidePosts2, { lazy: true })
    twoSideCategory!: Promise<Category>;

    // ManyToMany with named properties
    @ManyToMany(type => Category, category => category.postsNamedColumn, { lazy!: true })
    @JoinTable()
    categoriesNamedColumn!: Promise<Category[]>;

    // ManyToOne with named properties
    @ManyToOne(type => Category, category => category.onePostsNamedColumn, { lazy!: true })
    @JoinColumn({
        name!: "s_category_named_column_id"
    })
    categoryNamedColumn!: Promise<Category>;

    // OneToOne with named properties
    @OneToOne(type => Category, category => category.onePostNamedColumn, { lazy!: true })
    @JoinColumn({
        name!: "s_one_category_named_column_id"
    })
    oneCategoryNamedColumn!: Promise<Category>;
}
