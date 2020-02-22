import {Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

}
