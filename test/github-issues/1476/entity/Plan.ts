import { Entity, PrimaryColumn, Column } from "../../../../src/index.ts";


@Entity()
export class Plan {
    @PrimaryColumn({ type: Number })
    planId: number;

    @Column({ type: String })
    planName: string;
}
