import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {VersionColumn} from "../../../../../src/decorator/columns/VersionColumn.ts";
import {Category} from "./Category.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @Column({ type: String })
    description: string;

    @Column({ type: Number })
    rating: number;

    @VersionColumn()
    version: string;

    @ManyToOne(type => Category)
    category: Category;

}
