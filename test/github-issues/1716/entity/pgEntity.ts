import { PrimaryColumn, Entity, Column } from "../../../../src/index.ts";

@Entity()
export class PgEntity {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column("time")
    fieldTime!: Date;

    @Column("time with time zone")
    fieldTimeWithTZ!: Date;

    @Column("time without time zone")
    fieldTimeWithoutTZ!: Date;

    @Column("timestamp")
    fieldTimestamp!: Date;

    @Column("timestamp without time zone")
    fieldTimestampWithoutTZ!: Date;

    @Column("timestamp with time zone")
    fieldTimestampWithTZ!: Date;

}
