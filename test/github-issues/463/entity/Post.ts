import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    identifier: number;

    @Column("simple-array")
    names: string[];

}
