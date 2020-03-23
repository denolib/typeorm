import { PrimaryColumn, Column, OneToMany } from "../../../../../src/index.ts";
import { Entity } from "../../../../../src/decorator/entity/Entity.ts";
import { BaseEntity } from "../../../../../src/repository/BaseEntity.ts";

import { RecordContext } from "./context.ts";

@Entity({ name: "records" })
export class Record extends BaseEntity {
    @PrimaryColumn({ type: String })
    public id!: string;

    @OneToMany(type => RecordContext, context => context.record)
    public contexts!: RecordContext[];

    @Column({ type: String })
    public status!: "pending" | "failed" | "done";
}
