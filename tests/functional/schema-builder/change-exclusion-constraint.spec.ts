import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {PromiseUtils} from "../../../src";
import {Teacher} from "./entity/Teacher";
import {Post} from "./entity/Post";
import {ExclusionMetadata} from "../../../src/metadata/ExclusionMetadata";
import {PostgresDriver} from "../../../src/driver/postgres/PostgresDriver";

describe("schema builder > change exclusion constraint", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly add new exclusion constraint", () => PromiseUtils.runInSequence(connections, async connection => {
        // Only PostgreSQL supports exclusion constraints.
        if (!(connection.driver instanceof PostgresDriver))
            return;

        const teacherMetadata = connection.getMetadata(Teacher);
        const exclusionMetadata = new ExclusionMetadata({
            entityMetadata: teacherMetadata,
            args: {
                target: Teacher,
                expression: `USING gist ("name" WITH =)`
            }
        });
        exclusionMetadata.build(connection.namingStrategy);
        teacherMetadata.exclusions.push(exclusionMetadata);

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("teacher");
        await queryRunner.release();

        expect(table!.exclusions.length).toEqual(1);
    }));

    test("should correctly change exclusion", () => PromiseUtils.runInSequence(connections, async connection => {
        // Only PostgreSQL supports exclusion constraints.
        if (!(connection.driver instanceof PostgresDriver))
            return;

        const postMetadata = connection.getMetadata(Post);
        postMetadata.exclusions[0].expression = `USING gist ("tag" WITH =)`;
        postMetadata.exclusions[0].build(connection.namingStrategy);

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.exclusions[0].expression!.indexOf("tag")).not.toEqual(-1);
    }));

    test("should correctly drop removed exclusion", () => PromiseUtils.runInSequence(connections, async connection => {
        // Only PostgreSQL supports exclusion constraints.
        if (!(connection.driver instanceof PostgresDriver))
            return;

        const postMetadata = connection.getMetadata(Post);
        postMetadata.exclusions = [];

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.exclusions.length).toEqual(0);
    }));

});
