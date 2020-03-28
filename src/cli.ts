#!/usr/bin/env deno
import {createCliBuilder} from "./commands/CliBuilder.ts";
import {SchemaSyncCommand} from "./commands/SchemaSyncCommand.ts";
import {SchemaDropCommand} from "./commands/SchemaDropCommand.ts";
import {QueryCommand} from "./commands/QueryCommand.ts";
import {EntityCreateCommand} from "./commands/EntityCreateCommand.ts";
import {MigrationCreateCommand} from "./commands/MigrationCreateCommand.ts";
import {MigrationRunCommand} from "./commands/MigrationRunCommand.ts";
import {MigrationRevertCommand} from "./commands/MigrationRevertCommand.ts";
import {MigrationShowCommand} from "./commands/MigrationShowCommand.ts";
import {SubscriberCreateCommand} from "./commands/SubscriberCreateCommand.ts";
import {SchemaLogCommand} from "./commands/SchemaLogCommand.ts";
import {MigrationGenerateCommand} from "./commands/MigrationGenerateCommand.ts";
import {VersionCommand} from "./commands/VersionCommand.ts";
import {InitCommand} from "./commands/InitCommand.ts";
import {CacheClearCommand} from "./commands/CacheClearCommand.ts";
import {VERSION} from "./version.ts";

createCliBuilder()
    // .usage("Usage: $0 <command> [options]")
    .command(new SchemaSyncCommand())
    .command(new SchemaLogCommand())
    .command(new SchemaDropCommand())
    .command(new QueryCommand())
    .command(new EntityCreateCommand())
    .command(new SubscriberCreateCommand())
    .command(new MigrationCreateCommand())
    .command(new MigrationGenerateCommand())
    .command(new MigrationRunCommand())
    .command(new MigrationShowCommand())
    .command(new MigrationRevertCommand())
    .command(new VersionCommand())
    .command(new CacheClearCommand())
    .command(new InitCommand())
    // .recommendCommands()
    // .demandCommand(1)
    // .strict()
    // .alias("v", "version")
    // .help("h")
    // .alias("h", "help")
    // .argv;
    .version(VERSION)
    .parse();

// require("yargonaut")
//     .style("blue")
//     .style("yellow", "required")
//     .helpStyle("green")
//     .errorsStyle("red");

