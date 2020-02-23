import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {Role} from "./Role.ts";

@Entity()
export class User {
  @PrimaryColumn({ type: Number }) id: number;

  @PrimaryColumn({ type: String }) name: string;

  @Column({ type: String }) handedness: string;

  @ManyToMany(type => Role, {
      cascade: ["insert"]
})
  @JoinTable()
  roles: Role[];
}
