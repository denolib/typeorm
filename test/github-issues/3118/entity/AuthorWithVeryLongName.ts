import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column, Entity, ManyToOne, OneToMany} from "../../../../src/index.ts";
import {GroupWithVeryLongName} from "./GroupWithVeryLongName.ts";
import {PostWithVeryLongName} from "./PostWithVeryLongName.ts";

@Entity()
export class AuthorWithVeryLongName {
    @PrimaryGeneratedColumn()
    authorId: number;

    @Column({ type: String })
    firstName: string;

    @ManyToOne(() => GroupWithVeryLongName, group => group.authorsWithVeryLongName)
    groupWithVeryLongName: GroupWithVeryLongName;

    @OneToMany(() => PostWithVeryLongName, post => post.authorWithVeryLongName)
    postsWithVeryLongName: PostWithVeryLongName[];
}
