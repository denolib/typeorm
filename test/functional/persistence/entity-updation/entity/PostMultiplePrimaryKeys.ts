import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";

@Entity()
export class PostMultiplePrimaryKeys {

    @PrimaryColumn({ type: Number })
    firstId: number;

    @PrimaryColumn({ type: Number })
    secondId: number;

    @Column({ default: "Hello Multi Ids", type: String })
    text: string;

}
