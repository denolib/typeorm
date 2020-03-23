import {Entity, PrimaryGeneratedColumn, Column} from "../../../../src/index.ts";

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    gender!: string;

    @Column({ type: String })
    photo!: string;

}
