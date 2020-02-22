import { BaseEntity, Column, ManyToMany, PrimaryGeneratedColumn } from "../../../../src/index.ts";

import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { Foo } from "./Foo.ts";

@Entity()
export class Bar extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: String }) description: string;

  @ManyToMany(type => Foo, foo => foo.bars)
  foos?: Foo[];
}
