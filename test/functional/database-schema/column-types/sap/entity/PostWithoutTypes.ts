import {Entity} from "../../../../../../src/index.ts";
import {PrimaryColumn} from "../../../../../../src/index.ts";
import {Column} from "../../../../../../src/index.ts";

@Entity()
export class PostWithoutTypes {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: Boolean })
    boolean!: boolean;

    @Column({ type: Uint8Array })
    blob!: Uint8Array; /* Buffer; */

    @Column({ type: Date })
    timestamp!: Date;

}
