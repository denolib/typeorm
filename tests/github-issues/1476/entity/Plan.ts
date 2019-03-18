import { Entity, PrimaryColumn, Column } from "../../../../src";


@Entity()
export class Plan {
    @PrimaryColumn()
    planId: number;

    @Column()
    planName: string;
}
