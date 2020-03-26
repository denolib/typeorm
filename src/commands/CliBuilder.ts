import { cac } from "../../vendor/https/unpkg.com/cac/mod.js";

/**
 * This is a wrapper of cac.js that provides yargs-like API.
 */
interface CliBuilder {
    command(command: CommandModule): CliBuilder;
    parse(args?: string[]): object;
}

export interface CommandBuilder {
    option(
        shortname: string,
        options: {
            alias?: string
            default?: any
            demand?: boolean,
            describe: string
        }
    ): CommandBuilder;
}

export interface CommandModule {
    command: string
    describe: string
    builder(args: CommandBuilder): any
    handler(args: Args): any
}

export interface Args {
    _: string[];
    [option: string]: any;
}

function createCommandBuilder(cli: ReturnType<typeof cac>, module: CommandModule): CommandBuilder {
    const command = cli
        .command(module.command + " [...args]", module.describe, {})
        .action((_args: any[], options: object) => {
            const args = {
                _: [module.command, ..._args],
                ...options
            } as Args;
            validateRequiredOptions(args);
            return module.handler(args);
        });

    const requiredOptions = [] as string[];
    function validateRequiredOptions(args: Args): void {
        for (const requiredOption of requiredOptions) {
            if (args[requiredOption] == null) {
                throw new Error(`missing '-${requiredOption}' option for '${module.command}' command`);
            }
        }
    }

    const builder = {
        option(shortname, options) {
            if (options.demand) {
                requiredOptions.push(shortname);
            }
            const arg = options.demand ? '<arg>' : '[arg]';
            const option = options.alias ? `-${shortname}, --${options.alias} ${arg}` : `-${shortname} ${arg}`;
            command.option(option, options.describe, {
                default: options.default
            });
            return builder;
        }
    } as CommandBuilder;

    return builder;
}

export function createCliBuilder(): CliBuilder {
  const cli = cac("typeorm");
  const builder = {
    command(module: CommandModule) {
        module.builder(createCommandBuilder(cli, module));
        return builder;
    },
    parse(args: string[]) {
        return arguments.length === 0 ? cli.parse() : cli.parse(args);
    }
  } as CliBuilder;
  return builder;
}

