import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {OneToMany} from "../../../../../../../src/decorator/relations/OneToMany.ts";
import {Category} from "./Category.ts";

@Entity()
export class Image {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @OneToMany(type => Category, category => category.image)
    categories: Category[];

    categoryIds: number[];

}
