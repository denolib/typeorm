import {Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("int", { array: true, nullable: true})
    skill_id_array: number[];

}
