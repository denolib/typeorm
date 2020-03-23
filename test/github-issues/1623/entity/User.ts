import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    firstName!: string;

    @Column({ type: String })
    lastName!: string;

    @Column({ type: Number })
    age!: number;

}
