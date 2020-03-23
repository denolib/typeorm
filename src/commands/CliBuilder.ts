import { cac } from "../../vendor/https/unpkg.com/cac/mod.js";

interface CliBuilder {
  command(command: CommandModule): CliBuilder;
  parse(): object;
}

export interface CommandBuilder {
  option(
      shortname: string,
      options: {
          alias?: string
          default?: any
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
        .action((args: any[], options: object) => {
            return module.handler({
                _: [module.command, ...args],
                ...options
            });
        });
    const builder = {
        option(shortname, options) {
            const option = options.alias ? `-${shortname}, --${options.alias}` : `-${shortname}`;
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
    parse() {
        return cli.parse();
    }
  } as CliBuilder;
  return builder;
}

