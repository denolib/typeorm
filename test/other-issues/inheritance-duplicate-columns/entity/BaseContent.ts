import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

export class BaseContent {

    @PrimaryGeneratedColumn()
    id!: number;

}
