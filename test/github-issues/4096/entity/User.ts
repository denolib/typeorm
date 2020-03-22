import { Entity, PrimaryColumn, Column } from "../../../../src/index.ts";

@Entity()
export class User {
  @PrimaryColumn({ type: String })
  email!: string;

  @PrimaryColumn({ type: String })
  username!: string;

  @Column({ type: String })
  bio!: string;
}
