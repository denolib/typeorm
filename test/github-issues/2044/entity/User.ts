import {Column, Entity, OneToMany, PrimaryColumn} from "../../../../src/index.ts";
import {Photo} from "./Photo.ts";
// TODO(uki00a) Fix this test.
// import {StringDecoder} from "string_decoder";

@Entity()
export class User {

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

    @Column({ type: Number })
    age: number;

    @OneToMany(type => Photo, photo => photo.user)
    photos: Photo[];

}
