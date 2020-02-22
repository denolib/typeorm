import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { TableInheritance } from "../../../../src/decorator/entity/TableInheritance.ts";
import { Token } from "./Token.ts";
import { OneToOne, JoinColumn } from "../../../../src/index.ts";
import { Account } from "./Account.ts";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class AccountActivationToken extends Token {
  @OneToOne(type => Account, "accountActivationToken", {
    cascade: ["insert", "update"]
  })
  @JoinColumn()
  account: Account;

  constructor(public tokenSecret: string, public expiresOn: Date) {
    super();
  }
}
