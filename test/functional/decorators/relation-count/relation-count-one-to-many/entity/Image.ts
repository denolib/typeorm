import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {Category} from "./Category.ts";

@Entity()
export class Image {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToOne(type => Category, category => category.images)
    category!: Category;

}
