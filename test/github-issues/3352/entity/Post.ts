import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({
        type: "text",
    })
    text: string;

}
