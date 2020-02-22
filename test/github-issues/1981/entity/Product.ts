import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class Product {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: Boolean })
    liked: boolean;

}
