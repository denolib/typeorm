import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Error} from "./entity/Error.ts";

describe("github issues > #1887 Having problems with UNIQUEIDENTIFIERS", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["mssql"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly insert data", () => Promise.all(connections.map(async connection => {
        const errorRepository = connection.getRepository(Error);
        const err = new Error();
        err.errorDate = new Date();
        err.errorDescription = "test insert error";
        err.errorNumber = 505;
        err.executionGuid = "82E66316-AC4C-4EE2-8F98-66694FA38261";
        await errorRepository.insert(err);
    })));

});

runIfMain(import.meta);
