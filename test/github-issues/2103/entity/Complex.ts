import {Entity, Column, PrimaryColumn} from "../../../../src/index.ts";

@Entity()
export class Complex {

    @PrimaryColumn({ type: Number })
    id!: number;

    @PrimaryColumn({ type: Number })
    code!: number;

    @Column({ type: Number })
    x!: number;

}
