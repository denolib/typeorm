import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";

@Entity()
export class AccessToken {

    @PrimaryColumn({ type: String })
    access_token!: string;

}
