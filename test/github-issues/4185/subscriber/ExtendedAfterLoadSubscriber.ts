import {Post} from "../entity/Post.ts";
import {EntitySubscriberInterface, EventSubscriber} from "../../../../src/index.ts";
import {LoadEvent} from "../../../../src/subscriber/event/LoadEvent.ts";

@EventSubscriber()
export class ExtendedAfterLoadSubscriber
    implements EntitySubscriberInterface<Post> {
    listenTo() {
        return Post;
    }

    async afterLoad(entity: Post, event: LoadEvent<Post>) {
        entity.extendedSubscriberSaw = event;
    }
}
