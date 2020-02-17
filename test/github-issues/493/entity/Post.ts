import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: String })
    id: string;

    @Column({ type: String })
    title: string;

}
