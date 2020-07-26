import * as fs from "../util/fs.ts";
import * as path from "../../vendor/https/deno.land/std/path/mod.ts";

/**
 * Command line utils functions.
 */
export class CommandUtils {

    /**
     * Creates directories recursively.
     */
    static createDirectories(directory: string): Promise<void> {
        return fs.ensureDir(directory);
    }

    /**
     * Creates a file with the given content in the given path.
     */
    static async createFile(filePath: string, content: string, override: boolean = true): Promise<void> {
        await CommandUtils.createDirectories(path.dirname(filePath));

        if (override === false && await fs.exists(filePath))
            return;

        await Deno.writeTextFile(filePath, content);
    }

    /**
     * Reads everything from a given file and returns its content as a string.
     */
    static async readFile(filePath: string): Promise<string> {
        return Deno.readTextFile(filePath);
    }


    static async fileExists(filePath: string) {
        return fs.existsSync(filePath);
    }
}
