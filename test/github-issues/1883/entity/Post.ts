import {Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {FruitEnum} from "../enum/FruitEnum.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("enum", { enum: FruitEnum, default: FruitEnum.Apple })
    fruit!: FruitEnum;

}
