import {PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Entity} from "../../../../src/index.ts";

@Entity()
export class Author {

    @PrimaryGeneratedColumn("uuid")
    id!: string;
}
