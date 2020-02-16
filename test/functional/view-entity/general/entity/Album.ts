import {Entity, JoinColumn, ManyToOne} from "../../../../../src/index.ts";
import {Column} from "../../../../../src/index.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/index.ts";
import {Category} from "./Category.ts";

@Entity()
export class Album {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @Column({ type: Number })
    categoryId: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: "categoryId" })
    category: Category;

}
