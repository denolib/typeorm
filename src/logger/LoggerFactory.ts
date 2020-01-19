import {Logger} from "./Logger.ts";
import {LoggerOptions} from "./LoggerOptions.ts";
import {SimpleConsoleLogger} from "./SimpleConsoleLogger.ts";
import {AdvancedConsoleLogger} from "./AdvancedConsoleLogger.ts";
import {FileLogger} from "./FileLogger.ts";
import {DebugLogger} from "./DebugLogger.ts";

/**
 * Helps to create logger instances.
 */
export class LoggerFactory {

    /**
     * Creates a new logger depend on a given connection's driver.
     */
    create(logger?: "advanced-console"|"simple-console"|"file"|"debug"|Logger, options?: LoggerOptions): Logger {
        if (logger instanceof Object)
            return logger as Logger;

        if (logger) {
            switch (logger) {
                case "simple-console":
                    return new SimpleConsoleLogger(options);

                case "file":
                    return new FileLogger(options);

                case "advanced-console":
                    return new AdvancedConsoleLogger(options);

                case "debug":
                    return new DebugLogger();
            }
        }

        return new AdvancedConsoleLogger(options);
    }

}
