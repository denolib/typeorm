// import { StringDecoder } from "string_decoder";
import { Column, Entity, PrimaryColumn } from "../../../../src/index.ts";

@Entity()
export class User {

    @PrimaryColumn("binary", {
        length!: 16
    })
    public _id!: Uint8Array;
    get id(): string {
        //const decoder = new StringDecoder("hex");
        //return decoder.end(this._id);
        return '';
    }
    set id(value: string) {
        //this._id = Buffer.from(value, "hex");
    }

    @Column({ type: Number })
    age!: number;

}
