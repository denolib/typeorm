import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";

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
    datetime!: Date;

}
