import {Column, PrimaryGeneratedColumn} from "../../../../src/index.ts";

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ type: String }) firstname!: string;
  @Column({ type: String }) lastname!: string;
  @Column({ type: String }) fullname!: string;
}
