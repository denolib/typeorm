import {Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class LetterBox {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "point", srid: 4326 })
    coord: string;

}
