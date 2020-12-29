import yargs from "../../vendor/https/deno.land/x/yargs/deno.ts";
import type { Arguments } from "../../vendor/https/deno.land/x/yargs/deno-types.ts";

export type Argv = ReturnType<typeof yargs>;
export type { Arguments };

export interface CommandModule {
    command: string
    describe: string
    builder?(args: Argv): any
    handler(args: Arguments): any
}