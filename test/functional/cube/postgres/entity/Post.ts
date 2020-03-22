import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("cube", {
        nullable!: true
    })
    mainColor!: number[];

    @Column("cube", {
        nullable!: true,
        array!: true
    })
    colors!: number[][];
}
