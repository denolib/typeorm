import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {PromiseUtils} from "../../../src/index.ts";
import {Teacher} from "./entity/Teacher.ts";
import {Post} from "./entity/Post.ts";
import {CheckMetadata} from "../../../src/metadata/CheckMetadata.ts";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver.ts";

describe("schema builder > change check constraint", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly add new check constraint", () => PromiseUtils.runInSequence(connections, async connection => {
        // Mysql does not support check constraints.
        if (connection.driver instanceof MysqlDriver)
            return;

        const teacherMetadata = connection.getMetadata(Teacher);
        const checkMetadata = new CheckMetadata({
            entityMetadata: teacherMetadata,
            args: {
                target: Teacher,
                expression: `"name" <> 'asd'`
            }
        });
        checkMetadata.build(connection.namingStrategy);
        teacherMetadata.checks.push(checkMetadata);

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("teacher");
        await queryRunner.release();

        table!.checks.length.should.be.equal(1);
    }));

    it("should correctly change check", () => PromiseUtils.runInSequence(connections, async connection => {
        // Mysql does not support check constraints.
        if (connection.driver instanceof MysqlDriver)
            return;

        const postMetadata = connection.getMetadata(Post);
        postMetadata.checks[0].expression = `"likesCount" < 2000`;
        postMetadata.checks[0].build(connection.namingStrategy);

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        table!.checks[0].expression!.indexOf("2000").should.be.not.equal(-1);
    }));

    it("should correctly drop removed check", () => PromiseUtils.runInSequence(connections, async connection => {
        // Mysql does not support check constraints.
        if (connection.driver instanceof MysqlDriver)
            return;

        const postMetadata = connection.getMetadata(Post);
        postMetadata.checks = [];

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        table!.checks.length.should.be.equal(0);
    }));

});

runIfMain(import.meta);
