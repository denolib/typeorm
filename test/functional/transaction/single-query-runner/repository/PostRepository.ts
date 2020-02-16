import {AbstractRepository} from "../../../../../src/repository/AbstractRepository.ts";
import {Post} from "../entity/Post.ts";
import {EntityManager} from "../../../../../src/entity-manager/EntityManager.ts";
import {EntityRepository} from "../../../../../src/decorator/EntityRepository.ts";

@EntityRepository()
export class PostRepository extends AbstractRepository<Post> {

    save(post: Post) {
        return this.manager.save(post);
    }

    getManager(): EntityManager {
        return this.manager;
    }

}
