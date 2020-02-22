import {Column, Entity} from "../../../../src/index.ts";

@Entity()
export class Product {

    @Column({ type: Number, primary: true })
    id: number;

    @Column({ type: String })
    name: string;

}
