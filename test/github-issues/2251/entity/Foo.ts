import {Column, OneToMany, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { Bar } from "./Bar.ts";

@Entity("foo")
export class Foo {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: String, default: "foo description" }) description: string;

  @OneToMany(() => Bar, bar => bar.foo, { cascade: true, eager: true })
  bars?: Bar[];
}
