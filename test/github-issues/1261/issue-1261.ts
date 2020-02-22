import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {BaseEntity} from "../../../src/repository/BaseEntity.ts";
import {Bar} from "./entity/Bar.ts";
import {PromiseUtils} from "../../../src/index.ts";

describe("github issues > #1261 onDelete property on foreign key is not modified on sync", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    after(() => closeTestingConnections(connections));

    it("should modify onDelete property on foreign key on sync", () => PromiseUtils.runInSequence(connections, async connection => {

        await connection.synchronize();
        BaseEntity.useConnection(connection);

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("bar");
        table!.foreignKeys[0].onDelete!.should.be.equal("SET NULL");

        const metadata = connection.getMetadata(Bar);
        metadata.foreignKeys[0].onDelete = "CASCADE";
        await connection.synchronize();

        table = await queryRunner.getTable("bar");
        table!.foreignKeys[0].onDelete!.should.be.equal("CASCADE");

        await queryRunner.release();

    }));

});

runIfMain(import.meta);
