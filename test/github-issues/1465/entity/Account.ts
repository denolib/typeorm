import { Column } from "../../../../src/decorator/columns/Column.ts";
import { PrimaryGeneratedColumn } from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { AccountActivationToken } from "./AccountActivationToken.ts";
import { OneToOne } from "../../../../src/index.ts";

@Entity()
export class Account {
  @PrimaryGeneratedColumn() id: number;

  @OneToOne(type => AccountActivationToken, "account", { cascade: ["insert", "remove"] })
  accountActivationToken: AccountActivationToken;

  @Column({ type: String }) username: string;

  @Column({ type: String }) password: string;
}
