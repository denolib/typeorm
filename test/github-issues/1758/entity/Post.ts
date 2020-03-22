import {Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

}
