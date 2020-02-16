import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable
} from "../../../../../src/index.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: String,
        length: 500
    })
    name: string;

    @Column({ type: String })
    description: string;

    @Column({ type: String })
    filename: string;

    @Column({ type: Number })
    views: number;

    @Column({ type: Boolean })
    isPublished: boolean;

    @ManyToMany(type => Category)
    @JoinTable()
    categories: Category[];

}
