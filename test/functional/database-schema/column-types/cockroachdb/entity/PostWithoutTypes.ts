import {Entity} from "../../../../../../src/index.ts";
import {PrimaryColumn} from "../../../../../../src/index.ts";
import {Column} from "../../../../../../src/index.ts";

@Entity()
export class PostWithoutTypes {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    name: string;

    @Column({ type: Boolean })
    boolean: boolean;

    @Column({ type: Date })
    datetime: Date;

}
