import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Index} from "../../../../src/decorator/Index.ts";

@Entity()
export class Foo {
  @Column("date")
  @Index({ expireAfterSeconds: 0 })
  expireAt: Date;
}
