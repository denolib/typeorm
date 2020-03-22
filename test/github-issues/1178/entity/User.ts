import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;
}
