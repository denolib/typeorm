import {expandGlob} from "../../vendor/https/deno.land/std/fs/mod.ts";
import {PlatformTools} from "../platform/PlatformTools.ts";
import {EntitySchema} from "../index.ts";
import {Logger} from "../logger/Logger.ts";
/**
 * Loads all exported classes from the given directory.
 */
export async function importClassesFromDirectories(logger: Logger, directories: string[], formats = [".js", ".ts"]): Promise<Function[]> {

    const logLevel = "info";
    const classesNotFoundMessage = "No classes were found using the provided glob pattern: ";
    const classesFoundMessage = "All classes found using provided glob pattern";
    function loadFileClasses(mod: any, allLoaded: Function[]) {
        if (typeof mod === "function" || mod instanceof EntitySchema) {
            allLoaded.push(mod);

        } else if (Array.isArray(mod)) {
            mod.forEach((i: any) => loadFileClasses(i, allLoaded));

        } else {
            Object.keys(mod).forEach(key => loadFileClasses(mod[key], allLoaded));

        }
        return allLoaded;
    }

    const allFiles = [] as string[];
    for (const dir of directories) {
        for await (const {filename} of expandGlob(dir, { includeDirs: false })) {
            allFiles.push(filename);
        }
    }

    if (directories.length > 0 && allFiles.length === 0) {
        logger.log(logLevel, `${classesNotFoundMessage} "${directories}"`);
    } else if (allFiles.length > 0) {
        logger.log(logLevel, `${classesFoundMessage} "${directories}" : "${allFiles}"`);
    }
    const promises = allFiles
        .filter(file => {
            const dtsExtension = file.substring(file.length - 5, file.length);
            return formats.indexOf(PlatformTools.pathExtname(file)) !== -1 && dtsExtension !== ".d.ts";
        })
        .map(file => import(PlatformTools.pathResolve(file)));
    const dirs = (await Promise.all(promises)).map(mod => mod.default ? mod.default : mod);

    return loadFileClasses(dirs, []);
}

/**
 * Loads all json files from the given directory.
 */
export function importJsonsFromDirectories(directories: string[], format = ".json"): any[] {

    const allFiles = directories.reduce((allDirs, dir) => {
        return allDirs.concat(PlatformTools.load("glob").sync(PlatformTools.pathNormalize(dir)));
    }, [] as string[]);

    return allFiles
        .filter(file => PlatformTools.pathExtname(file) === format)
        .map(file => PlatformTools.load(PlatformTools.pathResolve(file)));
}
