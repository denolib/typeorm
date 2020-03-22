import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @ManyToMany(() => Category)
    @JoinTable()
    get categories() {
        return this._categories;
    }

    set categories(arr) {
        this._categories = arr;
    }

    private _categories!: Category[];


}
