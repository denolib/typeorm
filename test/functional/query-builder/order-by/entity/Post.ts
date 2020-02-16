import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";

@Entity({
    orderBy: {
        myOrder: "DESC"
    }
})
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: Number })
    myOrder: number;

    @Column({ type: Number })
    num1: number = 1;

    @Column({ type: Number })
    num2: number = 1;

}
