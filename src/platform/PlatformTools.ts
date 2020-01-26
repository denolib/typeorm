import * as path from "../../vendor/https/deno.land/std/path/mod.ts";
import * as colors from "../../vendor/https/deno.land/std/fmt/colors.ts";
import * as fs from "../../vendor/https/deno.land/std/fs/mod.ts";
import {NotImplementedError} from "../error/NotImplementedError.ts";
type Buffer = unknown;
export type ReadStream = unknown;

// TODO(uki00a) implement EventEmitter
export class EventEmitter {
    constructor() {
        throw new NotImplementedError('EventEmitter.constructor');
    }
}
// TODO(uki00a) implement Readable
export class Readable {
    constructor() {
        throw new NotImplementedError('Readable.constructor');
    }
}

// TODO(uki00a) implement Writable
export class Writable {
    constructor() {
        throw new NotImplementedError('Writable.constructor');
    }
}

/**
 * Platform-specific tools.
 */
export class PlatformTools {

    /**
     * Type of the currently running platform.
     */
    static type: "browser"|"deno" = "deno";

    /**
     * Gets global variable where global stuff can be stored.
     */
    static getGlobalVariable(): any {
        return window;
    }

    /**
     * Loads ("require"-s) given file or package.
     * This operation only supports on node platform
     */
    static load(name: string): any {

        // if name is not absolute or relative, then try to load package from the node_modules of the directory we are currently in
        // this is useful when we are using typeorm package globally installed and it accesses drivers
        // that are not installed globally

        throw new NotImplementedError('PlatformTools.load');
    }

    /**
     * Normalizes given path. Does "path.normalize".
     */
    static pathNormalize(pathStr: string): string {
        return path.normalize(pathStr);
    }

    /**
     * Gets file extension. Does "path.extname".
     */
    static pathExtname(pathStr: string): string {
        return path.extname(pathStr);
    }

    /**
     * Resolved given path. Does "path.resolve".
     */
    static pathResolve(pathStr: string): string {
        return path.resolve(pathStr);
    }

    /**
     * Synchronously checks if file exist. Does "fs.existsSync".
     */
    static fileExist(pathStr: string): boolean {
        return fs.existsSync(pathStr);
    }

    static readFileSync(filename: string): Buffer {
        throw new NotImplementedError('PlatformTools.readFileSync');
    }

    static appendFileSync(filename: string, data: any): void {
        throw new NotImplementedError('PlatformTools.appendFileSync');
    }

    static async writeFile(path: string, data: any): Promise<void> {
        throw new NotImplementedError('PlatformTools.writeFile');
    }

    /**
     * Gets environment variable.
     */
    static getEnvVariable(name: string): any {
        return Deno.env()[name];
    }

    // TODO(uki00a) implement this method.
    /**
     * Highlights sql string to be print in the console.
     */
    static highlightSql(sql: string) {
        return sql;
    }

    // TODO(uki00a) implement this method.
    /**
     * Highlights json string to be print in the console.
     */
    static highlightJson(json: string) {
        return json;
    }

    /**
     * Logging functions needed by AdvancedConsoleLogger
     */
    static logInfo(prefix: string, info: any) {
        console.log(colors.underline(colors.gray(prefix)), info);
    }

    static logError(prefix: string, error: any) {
        console.log(colors.underline(colors.red(prefix)), error);
    }

    static logWarn(prefix: string, warning: any) {
        console.log(colors.underline(colors.yellow(prefix)), warning);
    }

    static log(message: string) {
        console.log(colors.underline(message));
    }

    static warn(message: string) {
        return colors.yellow(message);
    }
}
