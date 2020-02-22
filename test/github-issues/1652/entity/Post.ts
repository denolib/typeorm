import {Entity, PrimaryColumn, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({ type: String })
    name: string;

}
