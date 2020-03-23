import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";

@Entity()
export class PostDetails {

    @PrimaryColumn({ type: String })
    keyword!: string;

}
