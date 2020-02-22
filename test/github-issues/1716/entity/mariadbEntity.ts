import { PrimaryColumn, Entity, Column } from "../../../../src/index.ts";

@Entity()
export class MariadbEntity {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column("time")
    fieldTime: Date;

    @Column("timestamp")
    fieldTimestamp: Date;

    @Column("datetime")
    fieldDatetime: Date;

}
