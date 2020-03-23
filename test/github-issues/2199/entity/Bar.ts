import { Column, PrimaryGeneratedColumn } from "../../../../src/index.ts";
import { Entity } from "../../../../src/decorator/entity/Entity.ts";

@Entity("bar")
export class Bar {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    description!: string;
}
