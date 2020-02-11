import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String, default: "hello default value", nullable: true })
    title?: string|null;

}
