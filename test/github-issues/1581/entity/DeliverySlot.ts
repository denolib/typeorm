import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class DeliverySlot {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

}
