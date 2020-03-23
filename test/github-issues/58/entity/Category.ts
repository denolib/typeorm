import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {OneToMany} from "../../../../src/decorator/relations/OneToMany.ts";
import {PostCategory} from "./PostCategory.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToMany(type => PostCategory, postCategory => postCategory.category)
    posts!: PostCategory[];

}
