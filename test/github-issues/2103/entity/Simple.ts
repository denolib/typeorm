import {Entity, Column, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class Simple {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: Number })
    x!: number;

}
