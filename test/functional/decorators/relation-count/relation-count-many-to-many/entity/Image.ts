import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../../src/decorator/relations/ManyToMany.ts";
import {RelationCount} from "../../../../../../src/decorator/relations/RelationCount.ts";
import {Category} from "./Category.ts";

@Entity()
export class Image {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToMany(type => Category, category => category.images)
    categories!: Category[];

    @RelationCount((image: Image) => image.categories)
    categoryCount!: number;

}
