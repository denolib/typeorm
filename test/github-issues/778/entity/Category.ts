import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: string;

    @Column({ type: String })
    name!: string;

}
