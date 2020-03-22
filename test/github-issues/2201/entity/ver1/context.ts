import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";
import { Column, PrimaryColumn, ManyToOne } from "../../../../../src/index.ts";
import { Entity } from "../../../../../src/decorator/entity/Entity.ts";
import { BaseEntity } from "../../../../../src/repository/BaseEntity.ts";

import { User } from "./user.ts";
import { Record } from "./record.ts";

@Entity({ name: "record_contexts" })
export class RecordContext extends BaseEntity {
    @PrimaryColumn({ type: String, name: "record_id"})
    recordId!: string;

    @PrimaryColumn({ type: String, name: "user_id"})
    userId!: string;

    @ManyToOne(type => Record, record => record.contexts)
    @JoinColumn({ name: "record_id" })
    public readonly record!: Record;

    @ManyToOne(type => User, user => user.contexts)
    @JoinColumn({ name: "user_id" })
    public readonly user!: User;

    @Column("simple-json")
    public readonly meta: any;
}
