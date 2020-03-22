import { Entity } from "../../../../../../src/decorator/entity/Entity.ts";
import { PrimaryGeneratedColumn } from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import { Column } from "../../../../../../src/decorator/columns/Column.ts";
import { ManyToMany } from "../../../../../../src/decorator/relations/ManyToMany.ts";
import { OneToMany } from "../../../../../../src/decorator/relations/OneToMany.ts";
import { OneToOne } from "../../../../../../src/decorator/relations/OneToOne.ts";
import {
    Post,
} from "./Post.ts";

@Entity("s_category_named_all", {
    orderBy!: {
        id!: "ASC",
    }
})
export class Category {

    @PrimaryGeneratedColumn({
        name!: "s_category_id",
    })
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToOne(type => Post, post => post.oneCategory, { lazy: true })
    onePost!: Promise<Post>;

    @ManyToMany(type => Post, post => post.twoSideCategories, { lazy: true })
    twoSidePosts!: Promise<Post[]>;

    @OneToMany(type => Post, post => post.twoSideCategory, { lazy: true })
    twoSidePosts2!: Promise<Post[]>;

    // ManyToMany with named properties
    @ManyToMany(type => Post, post => post.categoriesNamedAll, { lazy: true })
    postsNamedAll!: Promise<Post[]>;

    // OneToMany with named properties
    @OneToMany(type => Post, post => post.categoryNamedAll, { lazy: true })
    onePostsNamedAll!: Promise<Post[]>;

    // OneToOne with named properties
    @OneToOne(type => Post, post => post.oneCategoryNamedAll, { lazy: true })
    onePostNamedAll!: Promise<Post>;
}
