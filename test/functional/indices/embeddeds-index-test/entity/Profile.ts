import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Index} from "../../../../../src/decorator/Index.ts";

export class Profile {

    @Column({ type: String })
    job!: string;

    @Column({ type!: String })
    @Index("customer_profile_address")
    address!: string;
}
