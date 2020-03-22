import {Column, PrimaryGeneratedColumn, Entity} from "../../../../src/index.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: String })
    name2!: string;

}
