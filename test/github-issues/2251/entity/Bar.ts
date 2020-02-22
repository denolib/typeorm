import { Column, ManyToOne, PrimaryGeneratedColumn } from "../../../../src/index.ts";
import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { Foo } from "./Foo.ts";

@Entity()
export class Bar {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: String }) description: string;

  @ManyToOne(type => Foo, foo => foo.bars)
  foo?: Foo;
}
