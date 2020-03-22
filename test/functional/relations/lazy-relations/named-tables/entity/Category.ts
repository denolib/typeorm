import { Entity } from "../../../../../../src/decorator/entity/Entity.ts";
import { PrimaryGeneratedColumn } from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import { Column } from "../../../../../../src/decorator/columns/Column.ts";
import { ManyToMany } from "../../../../../../src/decorator/relations/ManyToMany.ts";
import { OneToMany } from "../../../../../../src/decorator/relations/OneToMany.ts";
import { OneToOne } from "../../../../../../src/decorator/relations/OneToOne.ts";
import {
    Post,
} from "./Post.ts";

@Entity("s_category", {
    orderBy!: {
        id!: "ASC",
    }
})
export class Category {

    @PrimaryGeneratedColumn()
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
    @ManyToMany(type => Post, post => post.categoriesNamedTable, { lazy: true })
    postsNamedTable!: Promise<Post[]>;

    // OneToMany with named properties
    @OneToMany(type => Post, post => post.categoryNamedTable, { lazy: true })
    onePostsNamedTable!: Promise<Post[]>;

    // OneToOne with named properties
    @OneToOne(type => Post, post => post.oneCategoryNamedTable, { lazy: true })
    onePostNamedTable!: Promise<Post>;
}
