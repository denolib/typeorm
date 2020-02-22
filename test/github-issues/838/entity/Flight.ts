import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Flight {

    constructor (id: number, date: Date) {
        this.id = id;
        this.date = date;
    }


    @PrimaryGeneratedColumn()
    id: number;

    @Column("timestamp with time zone")
    date: Date;

}
