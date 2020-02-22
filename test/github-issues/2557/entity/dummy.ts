import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {WrappedNumber, transformer} from "../transformer.ts";

@Entity()
export class Dummy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int", {transformer})
    num: WrappedNumber;
}
