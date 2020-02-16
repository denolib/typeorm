import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

export class Unit {

    @PrimaryGeneratedColumn()
    id: number;

}
