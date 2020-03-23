import { Column, Entity, PrimaryGeneratedColumn } from "../../../../src/index.ts";
import { Role } from "../set.ts";

@Entity("post")
export class Post {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column("set", {
    default!: [Role.Admin, Role.Developer],
    enum!: Role
  })
  roles!: Role[];
}
