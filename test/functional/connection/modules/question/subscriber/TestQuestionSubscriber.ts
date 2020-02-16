import {EventSubscriber} from "../../../../../../src/decorator/listeners/EventSubscriber.ts";
import {EntitySubscriberInterface} from "../../../../../../src/subscriber/EntitySubscriberInterface.ts";
import {InsertEvent} from "../../../../../../src/subscriber/event/InsertEvent.ts";

@EventSubscriber()
export class TestQuestionSubscriber implements EntitySubscriberInterface {

    /**
     * Called before entity insertion.
     */
    beforeInsert(event: InsertEvent<any>) {
        console.log(`BEFORE ENTITY INSERTED: `, event.entity);
    }

}
