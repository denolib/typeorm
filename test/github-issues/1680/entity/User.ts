import {Entity, Column, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String, unique: true })
    name: string;

}
