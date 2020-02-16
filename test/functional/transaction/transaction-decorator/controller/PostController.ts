import {Repository} from "../../../../../src/repository/Repository.ts";
import {Transaction} from "../../../../../src/decorator/transaction/Transaction.ts";
import {TransactionManager} from "../../../../../src/decorator/transaction/TransactionManager.ts";
// import {TransactionRepository} from "../../../../../src/decorator/transaction/TransactionRepository.ts";
import {EntityManager} from "../../../../../src/entity-manager/EntityManager.ts";

import {Post} from "../entity/Post.ts";
import {Category} from "../entity/Category.ts";
import {CategoryRepository} from "../repository/CategoryRepository.ts";

export class PostController {

    @Transaction("mysql") // "mysql" is a connection name. you can not pass it if you are using default connection.
    async save(post: Post, category: Category, @TransactionManager() entityManager: EntityManager) {
        await entityManager.save(post);
        await entityManager.save(category);
    }

    // this save is not wrapped into the transaction
    async nonSafeSave(entityManager: EntityManager, post: Post, category: Category) {
        await entityManager.save(post);
        await entityManager.save(category);
    }

    // TODO(uki00a) `@TransactionRepository` is not supported.
    @Transaction("mysql") // "mysql" is a connection name. you can not pass it if you are using default connection.
    async saveWithRepository(
        post: Post,
        category: Category,
        /*@TransactionRepository(Post)*/postRepository: Repository<Post>,
        /*@TransactionRepository()*/categoryRepository: CategoryRepository,
    ) {
        await postRepository.save(post);
        await categoryRepository.save(category);

        return categoryRepository.findByName(category.name);
    }

    @Transaction({ connectionName: "mysql", isolation: "SERIALIZABLE" }) // "mysql" is a connection name. you can not pass it if you are using default connection.
    async saveWithNonDefaultIsolation(post: Post, category: Category, @TransactionManager() entityManager: EntityManager) {
        await entityManager.save(post);
        await entityManager.save(category);
    }

}
