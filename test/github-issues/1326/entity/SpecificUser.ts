import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity("user", { database: "db_2" })
export class SpecificUser {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

}
