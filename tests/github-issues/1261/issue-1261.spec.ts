import "reflect-metadata";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {BaseEntity} from "../../../src";
import {Bar} from "./entity/Bar";
import {PromiseUtils} from "../../../src";

describe("github issues > #1261 onDelete property on foreign key is not modified on sync", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    afterAll(() => closeTestingConnections(connections));

    test("should modify onDelete property on foreign key on sync", () => PromiseUtils.runInSequence(connections, async connection => {

        // TODO: issue in CRDB
        if (connection.driver instanceof CockroachDriver)
            return;

        await connection.synchronize();
        BaseEntity.useConnection(connection);

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("bar");
        expect(table!.foreignKeys[0].onDelete)!.toEqual("SET NULL");

        const metadata = connection.getMetadata(Bar);
        metadata.foreignKeys[0].onDelete = "CASCADE";
        await connection.synchronize();

        table = await queryRunner.getTable("bar");
        expect(table!.foreignKeys[0].onDelete)!.toEqual("CASCADE");

        await queryRunner.release();

    }));

});
