import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn, ManyToOne} from "../../../../src/index.ts";
import {Role} from "./Role.ts";

@Entity()
export class User {

  @PrimaryColumn({ type: Number })
  id!: number;

  @ManyToOne(_ => Role, role => role.users)
  role!: Role;

}
