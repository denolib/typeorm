import { Entity, PrimaryColumn, Column } from "../../../../src/index.ts";

@Entity()
export class User {
  @PrimaryColumn({ type: String })
  name!: string;

  @PrimaryColumn({ type: String })
  email!: string;

  @Column({ type: Number })
  age!: number;
}
