import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {AuthorWithVeryLongName} from "./AuthorWithVeryLongName.ts";
import {ManyToMany, Entity, ManyToOne, Column} from "../../../../src/index.ts";
import {CategoryWithVeryLongName} from "./CategoryWithVeryLongName.ts";

@Entity()
export class PostWithVeryLongName {
    @PrimaryGeneratedColumn()
    postId!: number;

    @Column({ type: String, default: "dummy name" })
    name!: string;

    @ManyToOne(() => AuthorWithVeryLongName, author => author.postsWithVeryLongName)
    authorWithVeryLongName!: AuthorWithVeryLongName;

    @ManyToMany(() => CategoryWithVeryLongName, category => category.postsWithVeryLongName)
    categories!: CategoryWithVeryLongName[];
}
