import {Column, Entity, ManyToOne, PrimaryColumn} from "../../../../src/index.ts";
import {User} from "./User.ts";
//import {StringDecoder} from "string_decoder";

@Entity()
export class Photo {

  @PrimaryColumn("binary", {
    length: 2
  })
  private _id: Uint8Array;

  get id(): string {
      //const decoder = new StringDecoder("hex");

      //return decoder.end(this._id);
      return '';
  }
  set id(value: string) {
      //this._id = Buffer.from(value, "hex");
  }

  @Column({ type: String })
  description: string;

  @ManyToOne(type => User, user => user.photos)
  user: User;

}
