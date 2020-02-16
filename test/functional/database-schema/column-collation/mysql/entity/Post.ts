import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ collation: "ascii_general_ci", type: String })
    name: string;

    @Column({ charset: "utf8", type: String })
    title: string;

    @Column({ charset: "cp852", collation: "cp852_general_ci", type: String })
    description: string;

}
