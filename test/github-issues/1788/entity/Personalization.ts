import { Column, Entity, PrimaryGeneratedColumn } from "../../../../src/index.ts";

@Entity()
export class Personalization {
  @PrimaryGeneratedColumn("uuid") public id: number;

  @Column({ type: String }) public logo: string;
}
