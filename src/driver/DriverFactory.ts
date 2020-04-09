import {MissingDriverError} from "../error/MissingDriverError.ts";
import {SqliteDriver} from "./sqlite/SqliteDriver.ts";
import {Driver} from "./Driver.ts";
import {Connection} from "../connection/Connection.ts";
import {PostgresDriver} from "./postgres/PostgresDriver.ts";
import {MysqlDriver} from "./mysql/MysqlDriver.ts";

/**
 * Helps to create drivers.
 */
export class DriverFactory {

    /**
     * Creates a new driver depend on a given connection's driver type.
     */
    create(connection: Connection): Driver {
        const {type} = connection.options;
        switch (type) {
            case "mysql":
                return new MysqlDriver(connection);
            case "postgres":
                return new PostgresDriver(connection);
            case "sqlite":
                return new SqliteDriver(connection);
            default:
                throw new MissingDriverError(type);
        }
    }

}
