import { ChildEntity, Column, Entity, PrimaryColumn, TableInheritance } from "../../../../src/index.ts";

@TableInheritance({ column!: "type" })
@Entity()
export class User {
  @PrimaryColumn({ type: Number })
  id!: number;

  @Column({ type: String })
  type!: string;
}

@ChildEntity("sub")
export class SubUser extends User {
  @Column({ type: Number })
  anotherColumn!: number;
}
