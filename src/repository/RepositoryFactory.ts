import {TreeRepository} from "./TreeRepository.ts";
import {EntityMetadata} from "../metadata/EntityMetadata.ts";
import {Repository} from "./Repository.ts";
import {MongoDriver} from "../driver/mongodb/MongoDriver.ts";
import {MongoRepository} from "./MongoRepository.ts";
import {QueryRunner} from "../query-runner/QueryRunner.ts";
import {EntityManager} from "../entity-manager/EntityManager.ts";

/**
 * Factory used to create different types of repositories.
 */
export class RepositoryFactory {

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Creates a repository.
     */
    create(manager: EntityManager, metadata: EntityMetadata, queryRunner?: QueryRunner): Repository<any> {

        if (metadata.treeType) {
            // NOTE: dynamic access to protected properties. We need this to prevent unwanted properties in those classes to be exposed,
            // however we need these properties for internal work of the class
            const repository = new TreeRepository<any>();
            Object.assign(repository, {
                manager: manager,
                metadata: metadata,
                queryRunner: queryRunner,
            });
            return repository;

        } else {
            // NOTE: dynamic access to protected properties. We need this to prevent unwanted properties in those classes to be exposed,
            // however we need these properties for internal work of the class
            let repository: Repository<any>;
            if (manager.connection.driver instanceof MongoDriver) {
                repository = new MongoRepository();
            } else {
                repository = new Repository<any>();
            }
            Object.assign(repository, {
                manager: manager,
                metadata: metadata,
                queryRunner: queryRunner,
            });

            return repository;
        }
    }

}
