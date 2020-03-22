import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from "../../../../src/index.ts";
import { Personalization } from "./Personalization.ts";

@Entity()
export class Provider {
  @PrimaryGeneratedColumn("uuid") public id!: string;

  @Column({ type: String }) public name!: string;

  @Column({ type: String }) public description!: string;

  @OneToOne(_ => Personalization)
  @JoinColumn()
  public personalization!: Personalization;
}
