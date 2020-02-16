import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver.ts";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver.ts";
import {SapDriver} from "../../../src/driver/sap/SapDriver.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";

describe("schema builder > create table", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly create tables with all dependencies", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        let postTable = await queryRunner.getTable("post");
        let teacherTable = await queryRunner.getTable("teacher");
        let studentTable = await queryRunner.getTable("student");
        let facultyTable = await queryRunner.getTable("faculty");
        expect(postTable).to.be.undefined;
        expect(teacherTable).to.be.undefined;
        expect(studentTable).to.be.undefined;
        expect(facultyTable).to.be.undefined;

        await connection.synchronize();

        postTable = await queryRunner.getTable("post");
        const idColumn = postTable!.findColumnByName("id");
        const versionColumn = postTable!.findColumnByName("version");
        const nameColumn = postTable!.findColumnByName("name");
        postTable!.should.exist;

        if (connection.driver instanceof MysqlDriver || connection.driver instanceof SapDriver) {
            postTable!.indices.length.should.be.equal(2);
        } else {
            postTable!.uniques.length.should.be.equal(2);
            postTable!.checks.length.should.be.equal(1);
        }

        idColumn!.isPrimary.should.be.true;
        versionColumn!.isUnique.should.be.true;
        nameColumn!.default!.should.be.exist;

        teacherTable = await queryRunner.getTable("teacher");
        teacherTable!.should.exist;

        studentTable = await queryRunner.getTable("student");
        studentTable!.should.exist;
        studentTable!.foreignKeys.length.should.be.equal(2);
        // CockroachDB also stores indices for relation columns
        if (false/*connection.driver instanceof CockroachDriver*/) { // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            studentTable!.indices.length.should.be.equal(3);
        } else {
            studentTable!.indices.length.should.be.equal(1);
        }

        facultyTable = await queryRunner.getTable("faculty");
        facultyTable!.should.exist;

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
