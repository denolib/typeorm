import {Post} from "../entity/Post.ts";
import {EntitySubscriberInterface, EventSubscriber} from "../../../../src/index.ts";

// "Old" subscribers which only take one parameter should still compile and work

@EventSubscriber()
export class SimpleAfterLoadSubscriber
    implements EntitySubscriberInterface<Post> {
    listenTo() {
        return Post;
    }

    async afterLoad(entity: Post) {
        entity.simpleSubscriberSaw = true;
    }
}
