import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column, Entity, OneToMany} from "../../../../src/index.ts";
import {AuthorWithVeryLongName} from "./AuthorWithVeryLongName.ts";

@Entity()
export class GroupWithVeryLongName {
    @PrimaryGeneratedColumn()
    groupId!: number;

    @Column({ type: String })
    name!: string;

    @OneToMany(() => AuthorWithVeryLongName, author => author.groupWithVeryLongName)
    authorsWithVeryLongName!: AuthorWithVeryLongName[];
}
