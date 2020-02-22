import { Column, Entity, PrimaryColumn } from "../../../../src/index.ts";

@Entity()
export class Document {
  @PrimaryColumn({ type: Number })
  id: number;

  @Column({nullable: true, select: false, type: String})
  name: string;

  @Column({insert: false, select: false, nullable: true, type: Number})
  permission: number;

  @Column({insert: false, default: 1, type: Number})
  version: number;
}
