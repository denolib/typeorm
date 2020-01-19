import {ColumnMetadata} from "../../metadata/ColumnMetadata.ts";
import {RelationMetadata} from "../../metadata/RelationMetadata.ts";
import {EntityManager} from "../../entity-manager/EntityManager.ts";
import {QueryRunner} from "../../query-runner/QueryRunner.ts";
import {Connection} from "../../connection/Connection.ts";
import { EntityMetadata } from "../../metadata/EntityMetadata.ts";

/**
 * UpdateEvent is an object that broadcaster sends to the entity subscriber when entity is being updated in the database.
 */
export interface UpdateEvent<Entity> {

    /**
     * Connection used in the event.
     */
    connection: Connection;

    /**
     * QueryRunner used in the event transaction.
     * All database operations in the subscribed event listener should be performed using this query runner instance.
     */
    queryRunner: QueryRunner;

    /**
     * EntityManager used in the event transaction.
     * All database operations in the subscribed event listener should be performed using this entity manager instance.
     */
    manager: EntityManager;

    /**
     * Updating entity.
     */
    entity: Entity;

    /**
     * Metadata of the entity.
     */
    metadata: EntityMetadata;

    /**
     * Updating entity in the database.
     */
    databaseEntity: Entity;

    /**
     * List of updated columns. In query builder has no affected
     */
    updatedColumns: ColumnMetadata[];

    /**
     * List of updated relations. In query builder has no affected
     */
    updatedRelations: RelationMetadata[];

}
