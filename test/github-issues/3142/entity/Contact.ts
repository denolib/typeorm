import {Column} from "../../../../src/index.ts";

export class Contact {

    @Column({ type: String, unique: true })
    email: string;
}
