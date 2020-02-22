import { PrimaryColumn, OneToMany } from "../../../../../src/index.ts";
import { Entity } from "../../../../../src/decorator/entity/Entity.ts";
import { BaseEntity } from "../../../../../src/repository/BaseEntity.ts";

import { RecordContext } from "./context.ts";

@Entity({ name: "users" })
export class User extends BaseEntity {
    @PrimaryColumn({ type: String })
    public id: string;

    @OneToMany(type => RecordContext, context => context.user)
    public contexts: RecordContext[];
}
