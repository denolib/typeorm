import {Entity} from "../../../../../src/index.ts";
import {Column} from "../../../../../src/index.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/index.ts";
import {ManyToOne} from "../../../../../src/index.ts";
import {JoinColumn} from "../../../../../src/index.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: Number })
    categoryId!: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: "categoryId" })
    category!: Category;

}
