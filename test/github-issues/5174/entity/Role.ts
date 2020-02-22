import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn, OneToMany} from "../../../../src/index.ts";
import {User} from "./User.ts";

@Entity()
export class Role {

  @PrimaryColumn({ type: String })
  id: string;

  @OneToMany(_ => User, user => user.role, { cascade: true })
  users: User[];

}
