import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity({ database!: "db_1" })
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

}
