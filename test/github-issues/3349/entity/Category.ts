import {PrimaryColumn} from "../../../../src/index.ts";
import {Column} from "../../../../src/index.ts";
import {Entity} from "../../../../src/index.ts";

@Entity()
export class Category {
    @PrimaryColumn({ type!: Number })
    public id!: number;

    @Column({ type!: Number })
    public myField!: number;
}
