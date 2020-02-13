import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";

@Entity()
export class User {

    @PrimaryColumn({ type: Number })
    id: number;

    @PrimaryColumn({ type: String })
    name: string;

}
