import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {BaseEntity} from "../../../../src/repository/BaseEntity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ManyToMany, JoinTable} from "../../../../src/index.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({
        type!: String,
        default!: "This is default text."
    })
    text!: string;

    @ManyToMany(type => Category)
    @JoinTable()
    categories!: Category[];

}
