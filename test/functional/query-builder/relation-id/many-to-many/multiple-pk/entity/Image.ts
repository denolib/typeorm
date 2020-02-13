import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {Category} from "./Category.ts";

@Entity()
export class Image {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @ManyToMany(type => Category, category => category.images)
    categories: Category[];

    categoryIds: number[];

}
