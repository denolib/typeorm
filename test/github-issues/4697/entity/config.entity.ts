import {Entity, ObjectIdColumn, /*ObjectID,*/ Column} from "../../../../src/index.ts";

/**
 * @deprecated use item config instead
 */
@Entity()
export class Config {
  @ObjectIdColumn()
  _id: any;/*ObjectID;*/ // TODO(uki00a) uncomment this when MongoDriver is implemented.

  @Column({ type: String })
  itemId: string;

  @Column({ type: "json" })
  data: any;
}
