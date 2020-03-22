import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {LoadEvent} from "../../../../src/subscriber/event/LoadEvent.ts";

@Entity()
export class Post {
    @PrimaryColumn({ type: Number })
    id!: number;

    simpleSubscriberSaw?: boolean;
    extendedSubscriberSaw?: LoadEvent<Post>;
}
