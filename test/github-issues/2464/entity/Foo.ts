import { BaseEntity, JoinTable, ManyToMany, PrimaryColumn } from "../../../../src/index.ts";

import { Bar } from "./Bar.ts";
import { Entity } from "../../../../src/decorator/entity/Entity.ts";

@Entity("foo")
export class Foo  extends BaseEntity {
  @PrimaryColumn({ type: Number }) id!: number;

  @JoinTable()
  @ManyToMany(() => Bar, bar => bar.foos, {
    cascade!: ["insert", "update"],
    onDelete!: "NO ACTION"
  })
  bars?: Bar[];


  @JoinTable()
  @ManyToMany(() => Bar, bar => bar.foos, {
    cascade!: ["insert", "update"],
  })
  otherBars?: Bar[];
}
