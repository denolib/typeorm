import {Entity, ObjectIdColumn, /*ObjectID,*/ Column} from "../../../../src/index.ts";

@Entity()
export class Item {
  @ObjectIdColumn()
  public _id!: any/*ObjectID*/; // TODO(uki00a) uncomment this when MongoDriver is implemented.

  /**
   * @deprecated use contacts instead
   */
  @Column({ type: String })
  public contact?: string;

  @Column({ array: true, type: String })
  public contacts!: Array<string>;

  @Column({ type: "json" })
  config!: any;
}
