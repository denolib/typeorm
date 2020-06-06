import {Connection} from "../connection/Connection.ts";
import {EntityManager} from "./EntityManager.ts";
import {MongoEntityManager} from "./MongoEntityManager.ts";
import {MongoDriver} from "../driver/mongodb/MongoDriver.ts";
import {SqljsEntityManager} from "./SqljsEntityManager.ts";
import {SqljsDriver} from "../driver/sqljs/SqljsDriver.ts";
import {QueryRunner} from "../query-runner/QueryRunner.ts";

/**
 * Helps to create entity managers.
 */
export class EntityManagerFactory {

    /**
     * Creates a new entity manager depend on a given connection's driver.
     */
    create(connection: Connection, queryRunner?: QueryRunner): EntityManager {
        if (connection.driver instanceof MongoDriver)
            return new MongoEntityManager(connection);

        if (connection.driver instanceof SqljsDriver)
            return new SqljsEntityManager(connection, queryRunner);

        return new EntityManager(connection, queryRunner);
    }

}
