import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {BaseContent} from "./BaseContent.ts";

export class BasePost extends BaseContent {

    @PrimaryGeneratedColumn()
    id!: number;

}
