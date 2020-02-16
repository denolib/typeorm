import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Content} from "./Content.ts";

@Entity()
export class Post extends Content {

    @Column({ type: String })
    text: string;

}
