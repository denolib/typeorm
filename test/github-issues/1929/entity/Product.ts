import {Column, Entity, /*ObjectID,*/ ObjectIdColumn} from "../../../../src/index.ts";

@Entity()
export class Product {


    constructor(name: string, label: string, price: number) {
        this.name = name;
        this.label = label;
        this.price = price;
    }

    @ObjectIdColumn()
    id: any/*ObjectID*/; // TODO(uki00a) uncomment this when MongdbDriver is implemented.

    @Column({ type: String })
    name: string;

    @Column({ type: String })
    label: string;

    @Column({ type: Number })
    price: number;

}
