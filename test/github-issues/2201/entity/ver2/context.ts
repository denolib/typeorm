import { Column, PrimaryColumn, ManyToOne } from "../../../../../src/index.ts";
import { Entity } from "../../../../../src/decorator/entity/Entity.ts";
import { BaseEntity } from "../../../../../src/repository/BaseEntity.ts";

import { User } from "./user.ts";
import { Record } from "./record.ts";

@Entity({ name: "record_contexts" })
export class RecordContext extends BaseEntity {
    @PrimaryColumn({ type: String })
    recordId!: string;

    @PrimaryColumn({ type: String })
    userId!: string;

    @ManyToOne(type => Record, record => record.contexts)
    public readonly record!: Record;

    @ManyToOne(type => User, user => user.contexts)
    public readonly user!: User;

    @Column("simple-json")
    public readonly meta: any;
}
