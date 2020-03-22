import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";

@Entity()
export class Image {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToOne(type => Category, category => category.images)
    category!: Category[];

}
