import {Post} from "../entity/Post.ts";
import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from "../../../../src/index.ts";

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
    listenTo() {
        return Post;
    }

    async beforeInsert(event: InsertEvent<Post>) {
        event.entity.inserted = true;
    }

    async beforeUpdate(event: UpdateEvent<Post>) {
        event.entity.updated = true;
    }

}
