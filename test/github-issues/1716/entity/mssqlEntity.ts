import { PrimaryColumn, Entity, Column } from "../../../../src/index.ts";

@Entity()
export class MssqlEntity {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column("time")
    fieldTime: Date;

    @Column("datetime")
    fieldDatetime: Date;

    @Column("datetime2")
    fieldDatetime2: Date;

    @Column("datetimeoffset")
    fieldDatetimeoffset: Date;

}
