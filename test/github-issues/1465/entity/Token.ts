import { Column } from "../../../../src/decorator/columns/Column.ts";
import { PrimaryGeneratedColumn } from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { TableInheritance } from "../../../../src/decorator/entity/TableInheritance.ts";

@Entity()
@TableInheritance({column: {type: "varchar", name!: "type"}})
export class Token {
  @PrimaryGeneratedColumn() id!: number;

  @Column({ type: String }) tokenSecret!: string;

  @Column({ type: Date }) expiresOn!: Date;
}
