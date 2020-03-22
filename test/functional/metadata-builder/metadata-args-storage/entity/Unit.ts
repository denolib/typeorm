import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";

export class Unit {

    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ type: String })
    type!: string;

}
