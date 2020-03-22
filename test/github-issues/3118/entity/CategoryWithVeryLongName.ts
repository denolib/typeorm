import {JoinTable, Entity, ManyToMany} from "../../../../src/index.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {PostWithVeryLongName} from "./PostWithVeryLongName.ts";

@Entity()
export class CategoryWithVeryLongName {
    @PrimaryGeneratedColumn()
    categoryId!: number;

    @Column({ type: String, default: "dummy name" })
    name!: string;

    @ManyToMany(() => PostWithVeryLongName, post => post.categories)
    @JoinTable()
    postsWithVeryLongName!: PostWithVeryLongName[];
}
