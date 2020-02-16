import {EntitySubscriberInterface} from "../../../../src/subscriber/EntitySubscriberInterface.ts";
import {EventSubscriber} from "../../../../src/decorator/listeners/EventSubscriber.ts";
import {InsertEvent} from "../../../../src/subscriber/event/InsertEvent.ts";

@EventSubscriber()
export class SecondConnectionSubscriber implements EntitySubscriberInterface {

    /**
     * Called after entity insertion.
     */
    beforeInsert(event: InsertEvent<any>) {
        console.log(`BEFORE ENTITY INSERTED: `, event.entity);
    }

}
