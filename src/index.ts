/*!
 */
import {ConnectionManager} from "./connection/ConnectionManager.ts";
import {Connection} from "./connection/Connection.ts";
import {MetadataArgsStorage} from "./metadata-args/MetadataArgsStorage.ts";
import {ConnectionOptions} from "./connection/ConnectionOptions.ts";
import {getFromContainer} from "./container.ts";
import {ObjectType} from "./common/ObjectType.ts";
import {Repository} from "./repository/Repository.ts";
import {EntityManager} from "./entity-manager/EntityManager.ts";
import {PlatformTools} from "./platform/PlatformTools.ts";
import {TreeRepository} from "./repository/TreeRepository.ts";
import {MongoRepository} from "./repository/MongoRepository.ts";
import {ConnectionOptionsReader} from "./connection/ConnectionOptionsReader.ts";
import {PromiseUtils} from "./util/PromiseUtils.ts";
import {MongoEntityManager} from "./entity-manager/MongoEntityManager.ts";
import {SqljsEntityManager} from "./entity-manager/SqljsEntityManager.ts";
import {SqliteEntityManager} from "./entity-manager/SqliteEntityManager.ts";
import {SelectQueryBuilder} from "./query-builder/SelectQueryBuilder.ts";
import {EntitySchema} from "./entity-schema/EntitySchema.ts";

// -------------------------------------------------------------------------
// Commonly Used exports
// -------------------------------------------------------------------------

export * from "./container.ts";
export * from "./common/ObjectType.ts";
export * from "./common/ObjectLiteral.ts";
export * from "./common/DeepPartial.ts";
export * from "./error/QueryFailedError.ts";
export * from "./decorator/columns/Column.ts";
export * from "./decorator/columns/CreateDateColumn.ts";
export * from "./decorator/columns/PrimaryGeneratedColumn.ts";
export * from "./decorator/columns/PrimaryColumn.ts";
export * from "./decorator/columns/UpdateDateColumn.ts";
export * from "./decorator/columns/VersionColumn.ts";
export * from "./decorator/columns/ViewColumn.ts";
export * from "./decorator/columns/ObjectIdColumn.ts";
export * from "./decorator/listeners/AfterInsert.ts";
export * from "./decorator/listeners/AfterLoad.ts";
export * from "./decorator/listeners/AfterRemove.ts";
export * from "./decorator/listeners/AfterUpdate.ts";
export * from "./decorator/listeners/BeforeInsert.ts";
export * from "./decorator/listeners/BeforeRemove.ts";
export * from "./decorator/listeners/BeforeUpdate.ts";
export * from "./decorator/listeners/EventSubscriber.ts";
export * from "./decorator/options/ColumnOptions.ts";
export * from "./decorator/options/IndexOptions.ts";
export * from "./decorator/options/JoinColumnOptions.ts";
export * from "./decorator/options/JoinTableOptions.ts";
export * from "./decorator/options/RelationOptions.ts";
export * from "./decorator/options/EntityOptions.ts";
export * from "./decorator/options/ValueTransformer.ts";
export * from "./decorator/relations/JoinColumn.ts";
export * from "./decorator/relations/JoinTable.ts";
export * from "./decorator/relations/ManyToMany.ts";
export * from "./decorator/relations/ManyToOne.ts";
export * from "./decorator/relations/OneToMany.ts";
export * from "./decorator/relations/OneToOne.ts";
export * from "./decorator/relations/RelationCount.ts";
export * from "./decorator/relations/RelationId.ts";
export * from "./decorator/entity/Entity.ts";
export * from "./decorator/entity/ChildEntity.ts";
export * from "./decorator/entity/TableInheritance.ts";
export * from "./decorator/entity-view/ViewEntity.ts";
export * from "./decorator/transaction/Transaction.ts";
export * from "./decorator/transaction/TransactionManager.ts";
export * from "./decorator/transaction/TransactionRepository.ts";
export * from "./decorator/tree/TreeLevelColumn.ts";
export * from "./decorator/tree/TreeParent.ts";
export * from "./decorator/tree/TreeChildren.ts";
export * from "./decorator/tree/Tree.ts";
export * from "./decorator/Index.ts";
export * from "./decorator/Unique.ts";
export * from "./decorator/Check.ts";
export * from "./decorator/Exclusion.ts";
export * from "./decorator/Generated.ts";
export * from "./decorator/EntityRepository.ts";
export * from "./find-options/operator/Any.ts";
export * from "./find-options/operator/Between.ts";
export * from "./find-options/operator/Equal.ts";
export * from "./find-options/operator/In.ts";
export * from "./find-options/operator/IsNull.ts";
export * from "./find-options/operator/LessThan.ts";
export * from "./find-options/operator/LessThanOrEqual.ts";
export * from "./find-options/operator/Like.ts";
export * from "./find-options/operator/MoreThan.ts";
export * from "./find-options/operator/MoreThanOrEqual.ts";
export * from "./find-options/operator/Not.ts";
export * from "./find-options/operator/Raw.ts";
export * from "./find-options/FindConditions.ts";
export * from "./find-options/FindManyOptions.ts";
export * from "./find-options/FindOneOptions.ts";
export * from "./find-options/FindOperator.ts";
export * from "./find-options/FindOperatorType.ts";
export * from "./find-options/JoinOptions.ts";
export * from "./find-options/OrderByCondition.ts";
export * from "./find-options/FindOptionsUtils.ts";
export * from "./logger/Logger.ts";
export * from "./logger/AdvancedConsoleLogger.ts";
export * from "./logger/SimpleConsoleLogger.ts";
export * from "./logger/FileLogger.ts";
export * from "./metadata/EntityMetadata.ts";
export * from "./entity-manager/EntityManager.ts";
export * from "./repository/AbstractRepository.ts";
export * from "./repository/Repository.ts";
export * from "./repository/BaseEntity.ts";
export * from "./repository/TreeRepository.ts";
export * from "./repository/MongoRepository.ts";
export * from "./repository/RemoveOptions.ts";
export * from "./repository/SaveOptions.ts";
export * from "./schema-builder/table/TableCheck.ts";
export * from "./schema-builder/table/TableColumn.ts";
export * from "./schema-builder/table/TableExclusion.ts";
export * from "./schema-builder/table/TableForeignKey.ts";
export * from "./schema-builder/table/TableIndex.ts";
export * from "./schema-builder/table/TableUnique.ts";
export * from "./schema-builder/table/Table.ts";
// export * from "./driver/mongodb/typings.ts";
export * from "./driver/types/DatabaseType.ts";
// export * from "./driver/sqlserver/MssqlParameter.ts";

export {ConnectionOptionsReader} from "./connection/ConnectionOptionsReader.ts";
export {Connection} from "./connection/Connection.ts";
export {ConnectionManager} from "./connection/ConnectionManager.ts";
export {ConnectionOptions} from "./connection/ConnectionOptions.ts";
export {Driver} from "./driver/Driver.ts";
export {QueryBuilder} from "./query-builder/QueryBuilder.ts";
export {SelectQueryBuilder} from "./query-builder/SelectQueryBuilder.ts";
export {DeleteQueryBuilder} from "./query-builder/DeleteQueryBuilder.ts";
export {InsertQueryBuilder} from "./query-builder/InsertQueryBuilder.ts";
export {UpdateQueryBuilder} from "./query-builder/UpdateQueryBuilder.ts";
export {RelationQueryBuilder} from "./query-builder/RelationQueryBuilder.ts";
export {Brackets} from "./query-builder/Brackets.ts";
export {WhereExpression} from "./query-builder/WhereExpression.ts";
export {InsertResult} from "./query-builder/result/InsertResult.ts";
export {UpdateResult} from "./query-builder/result/UpdateResult.ts";
export {DeleteResult} from "./query-builder/result/DeleteResult.ts";
export {QueryRunner} from "./query-runner/QueryRunner.ts";
export {EntityManager} from "./entity-manager/EntityManager.ts";
export {MongoEntityManager} from "./entity-manager/MongoEntityManager.ts";
export {Migration} from "./migration/Migration.ts";
export {MigrationExecutor} from "./migration/MigrationExecutor.ts";
export {MigrationInterface} from "./migration/MigrationInterface.ts";
export {DefaultNamingStrategy} from "./naming-strategy/DefaultNamingStrategy.ts";
export {NamingStrategyInterface} from "./naming-strategy/NamingStrategyInterface.ts";
export {Repository} from "./repository/Repository.ts";
export {TreeRepository} from "./repository/TreeRepository.ts";
export {MongoRepository} from "./repository/MongoRepository.ts";
export {FindOneOptions} from "./find-options/FindOneOptions.ts";
export {FindManyOptions} from "./find-options/FindManyOptions.ts";
export {InsertEvent} from "./subscriber/event/InsertEvent.ts";
export {UpdateEvent} from "./subscriber/event/UpdateEvent.ts";
export {RemoveEvent} from "./subscriber/event/RemoveEvent.ts";
export {EntitySubscriberInterface} from "./subscriber/EntitySubscriberInterface.ts";
export {BaseEntity} from "./repository/BaseEntity.ts";
export {EntitySchema} from "./entity-schema/EntitySchema.ts";
export {EntitySchemaColumnOptions} from "./entity-schema/EntitySchemaColumnOptions.ts";
export {EntitySchemaIndexOptions} from "./entity-schema/EntitySchemaIndexOptions.ts";
export {EntitySchemaRelationOptions} from "./entity-schema/EntitySchemaRelationOptions.ts";
export {ColumnType} from "./driver/types/ColumnTypes.ts";
export {PromiseUtils} from "./util/PromiseUtils.ts";

// -------------------------------------------------------------------------
// Deprecated
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// Commonly used functionality
// -------------------------------------------------------------------------

/**
 * Gets metadata args storage.
 */
export function getMetadataArgsStorage(): MetadataArgsStorage {
    // we should store metadata storage in a global variable otherwise it brings too much problems
    // one of the problem is that if any entity (or any other) will be imported before consumer will call
    // useContainer method with his own container implementation, that entity will be registered in the
    // old old container (default one post probably) and consumer will his entity.
    // calling useContainer before he imports any entity (or any other) is not always convenient.
    // another reason is that when we run migrations typeorm is being called from a global package
    // and it may load entities which register decorators in typeorm of local package
    // this leads to impossibility of usage of entities in migrations and cli related operations
    const globalScope = PlatformTools.getGlobalVariable();
    if (!globalScope.typeormMetadataArgsStorage)
        globalScope.typeormMetadataArgsStorage = new MetadataArgsStorage();

    return globalScope.typeormMetadataArgsStorage;
}

/**
 * Reads connection options stored in ormconfig configuration file.
 */
export async function getConnectionOptions(connectionName: string = "default"): Promise<ConnectionOptions> {
    return new ConnectionOptionsReader().get(connectionName);
}

/**
 * Gets a ConnectionManager which creates connections.
 */
export function getConnectionManager(): ConnectionManager {
    return getFromContainer(ConnectionManager);
}

/**
 * Creates a new connection and registers it in the manager.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export async function createConnection(): Promise<Connection>;

/**
 * Creates a new connection from the ormconfig file with a given name.
 */
export async function createConnection(name: string): Promise<Connection>;

/**
 * Creates a new connection and registers it in the manager.
 */
export async function createConnection(options: ConnectionOptions): Promise<Connection>;

/**
 * Creates a new connection and registers it in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export async function createConnection(optionsOrName?: any): Promise<Connection> {
    const connectionName = typeof optionsOrName === "string" ? optionsOrName : "default";
    const options = optionsOrName instanceof Object ? optionsOrName : await getConnectionOptions(connectionName);
    return getConnectionManager().create(options).connect();
}

/**
 * Creates new connections and registers them in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * All connections from the ormconfig will be created.
 */
export async function createConnections(options?: ConnectionOptions[]): Promise<Connection[]> {
    if (!options)
        options = await new ConnectionOptionsReader().all();
    const connections = options.map(options => getConnectionManager().create(options));
    return PromiseUtils.runInSequence(connections, connection => connection.connect());
}

/**
 * Gets connection from the connection manager.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export function getConnection(connectionName: string = "default"): Connection {
    return getConnectionManager().get(connectionName);
}

/**
 * Gets entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export function getManager(connectionName: string = "default"): EntityManager {
    return getConnectionManager().get(connectionName).manager;
}

/**
 * Gets MongoDB entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export function getMongoManager(connectionName: string = "default"): MongoEntityManager {
    return getConnectionManager().get(connectionName).manager as MongoEntityManager;
}

/**
 * Gets Sqljs entity manager from connection name.
 * "default" connection is used, when no name is specified.
 * Only works when Sqljs driver is used.
 */
export function getSqljsManager(connectionName: string = "default"): SqljsEntityManager {
    return getConnectionManager().get(connectionName).manager as SqljsEntityManager;
}

/**
 * Gets Sqlite entity manager from connection name.
 * "default" connection is used, when no name is specified.
 * Only works when sqlite driver is used.
 */
export function getSqliteManager(connectionName: string = "default"): SqliteEntityManager {
    return getConnectionManager().get(connectionName).manager as SqliteEntityManager;
}

/**
 * Gets repository for the given entity class.
 */
export function getRepository<Entity>(entityClass: ObjectType<Entity>|EntitySchema<Entity>|string, connectionName: string = "default"): Repository<Entity> {
    return getConnectionManager().get(connectionName).getRepository<Entity>(entityClass);
}

/**
 * Gets tree repository for the given entity class.
 */
export function getTreeRepository<Entity>(entityClass: ObjectType<Entity>|string, connectionName: string = "default"): TreeRepository<Entity> {
    return getConnectionManager().get(connectionName).getTreeRepository<Entity>(entityClass);
}

/**
 * Gets tree repository for the given entity class.
 */
export function getCustomRepository<T>(customRepository: ObjectType<T>, connectionName: string = "default"): T {
    return getConnectionManager().get(connectionName).getCustomRepository(customRepository);
}

/**
 * Gets mongodb repository for the given entity class or name.
 */
export function getMongoRepository<Entity>(entityClass: ObjectType<Entity>|string, connectionName: string = "default"): MongoRepository<Entity> {
    return getConnectionManager().get(connectionName).getMongoRepository<Entity>(entityClass);
}

/**
 * Creates a new query builder.
 */
export function createQueryBuilder<Entity>(entityClass?: ObjectType<Entity>|string, alias?: string, connectionName: string = "default"): SelectQueryBuilder<Entity> {
    if (entityClass) {
        return getRepository(entityClass, connectionName).createQueryBuilder(alias);
    }

    return getConnection(connectionName).createQueryBuilder();
}
