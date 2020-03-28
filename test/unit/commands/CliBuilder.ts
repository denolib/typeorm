import { runIfMain } from "../../deps/mocha.ts";
import sinon from "../../deps/sinon.ts";
import { expect } from "../../deps/chai.ts";
import { createCliBuilder, CommandBuilder } from "../../../src/commands/CliBuilder.ts";

describe("unit > commands > CliBuilder", () => {
    it("should fill default values for options", () => {
        const cli = createCliBuilder();
        const command = {
            command: "test",
            describe: "This is a test command",
            builder(args: CommandBuilder) {
                return args
                    .option("d", {
                        default: "/path/to/dir",
                        describe: "dir"
                    })
                    .option("v", {
                        describe: "verbose"
                    });
            },
            handler: sinon.spy()
        };

        cli.command(command).parse([
            "deno",
            "cli.ts",
            "test",
            "-v"
        ]);

        sinon.assert.calledOnce(command.handler);
        sinon.assert.calledWithMatch(command.handler, {
            "d": "/path/to/dir",
            "v": true
        });
    });

    it("should recognize aliases", () => {
        const cli = createCliBuilder();
        const command = {
            command: "foo",
            describe: "bar",
            builder(args: CommandBuilder) {
                return args
                    .option("i", {
                        alias: "in",
                        describe: "foo"
                    })
                    .option("o", {
                        alias: "out",
                        describe: "bar"
                    });
            },
            handler: sinon.spy()
        };

        cli.command(command).parse([
            "deno",
            "cli.ts",
            "foo",
            "-i", "in.txt",
            "--out", "out.txt"
        ]);

        sinon.assert.calledOnce(command.handler);
        sinon.assert.calledWithMatch(command.handler, {
            "i": "in.txt",
            "in": "in.txt",
            "o": "out.txt",
            "out": "out.txt"
        });
    });

    it("should fail when a demand option is not present", () => {
        const cli = createCliBuilder();
        const command = {
            command: "test",
            describe: "This is a test command",
            builder(args: CommandBuilder) {
                return args
                    .option("r", {
                        describe: "This is required",
                        demand: true
                    });
            },
            handler: sinon.spy()
        };

        expect(() => cli.command(command).parse(["deno", "cli.ts", "test"])).to.throw("missing '-r' option for 'test' command");
        sinon.assert.notCalled(command.handler);
    });

    it("should dispatch an appropriate command", () => {
        const cli = createCliBuilder();
        const foo = {
            command: "foo",
            describe: "This should not be dispatched",
            builder() {},
            handler: sinon.spy()
        };
        const bar = {
            command: "bar",
            describe: "This should be dispatched",
            builder() {},
            handler: sinon.spy()
        };

        cli
            .command(foo)
            .command(bar)
            .parse([
                "deno",
                "cli.ts",
                "bar"
            ]);

        sinon.assert.notCalled(foo.handler);
        sinon.assert.calledOnce(bar.handler);
        sinon.assert.calledWithMatch(bar.handler, {
            _: ["bar"]
        });
    });
});

runIfMain(import.meta);
