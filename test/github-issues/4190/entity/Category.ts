import {Entity, PrimaryGeneratedColumn, Column} from "../../../../src/index.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

}
