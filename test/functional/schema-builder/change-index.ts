import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {PromiseUtils} from "../../../src/index.ts";
import {IndexMetadata} from "../../../src/metadata/IndexMetadata.ts";
import {Post} from "./entity/Post.ts";
import {Album} from "./entity/Album.ts";
import {Category} from "./entity/Category.ts";
import {Faculty} from "./entity/Faculty.ts";
import {Photo} from "./entity/Photo.ts";
import {PostVersion} from "./entity/PostVersion.ts";
import {Question} from "./entity/Question.ts";
import {Teacher} from "./entity/Teacher.ts";
import {Student} from "./entity/Student.ts";
import {TableIndex} from "../../../src/schema-builder/table/TableIndex.ts";

describe("schema builder > change index", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Post, Album, Category, Faculty, Photo, PostVersion, Question, Student, Teacher],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly add new index", () => PromiseUtils.runInSequence(connections, async connection => {
        const teacherMetadata = connection.getMetadata(Teacher);
        const nameColumn = teacherMetadata.findColumnWithPropertyName("name")!;
        const indexMetadata = new IndexMetadata({
            entityMetadata: teacherMetadata,
            columns: [nameColumn],
            args: {
                target: Teacher,
                synchronize: true
            }
        });
        indexMetadata.build(connection.namingStrategy);
        teacherMetadata.indices.push(indexMetadata);

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const teacherTable = await queryRunner.getTable("teacher");
        await queryRunner.release();

        teacherTable!.indices.length.should.be.equal(1);

        // revert changes
        teacherMetadata.indices.splice(teacherMetadata.indices.indexOf(indexMetadata), 1);
    }));

    it("should correctly change index", () => PromiseUtils.runInSequence(connections, async connection => {
        const studentMetadata = connection.getMetadata(Student);
        studentMetadata.indices[0].name = "changed_index";

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const studentTable = await queryRunner.getTable("student");
        await queryRunner.release();

        const index = studentTable!.indices.find(i => i.name === "changed_index");
        expect(index).not.be.undefined;
    }));

    it("should correctly drop removed index", () => PromiseUtils.runInSequence(connections, async connection => {
        const studentMetadata = connection.getMetadata(Student);
        studentMetadata.indices.splice(0, 1);

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const studentTable = await queryRunner.getTable("student");
        await queryRunner.release();
        // CockroachDB also stores indices for relation columns
        if (false/*connection.driver instanceof CockroachDriver*/) { // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            studentTable!.indices.length.should.be.equal(2);
        } else {
            studentTable!.indices.length.should.be.equal(0);
        }
    }));

    it("should ignore index synchronization when `synchronize` set to false", () => PromiseUtils.runInSequence(connections, async connection => {

        // You can not disable synchronization for unique index in CockroachDB, because unique indices are stored as UNIQUE constraints

        const queryRunner = connection.createQueryRunner();
        let teacherTable = await queryRunner.getTable("teacher");
        teacherTable!.indices.length.should.be.equal(0);

        const index = new TableIndex({ name: "ignored_index", columnNames: ["name"], isUnique: true });
        await queryRunner.createIndex(teacherTable!, index);

        teacherTable = await queryRunner.getTable("teacher");
        // CockroachDB stores unique indices as UNIQUE constraints
        if (false/*connection.driver instanceof CockroachDriver*/) { // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            teacherTable!.indices.length.should.be.equal(0);
            teacherTable!.uniques.length.should.be.equal(1);
            teacherTable!.findColumnByName("name")!.isUnique.should.be.true;
        } else {
            teacherTable!.indices.length.should.be.equal(1);
            teacherTable!.indices[0].isUnique!.should.be.true;
        }

        await connection.synchronize();

        teacherTable = await queryRunner.getTable("teacher");
        // CockroachDB stores unique indices as UNIQUE constraints
        if (false/*connection.driver instanceof CockroachDriver*/) { // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            teacherTable!.indices.length.should.be.equal(0);
            teacherTable!.uniques.length.should.be.equal(0);
            teacherTable!.findColumnByName("name")!.isUnique.should.be.false;
        } else {
            teacherTable!.indices.length.should.be.equal(1);
            teacherTable!.indices[0].isUnique!.should.be.true;
        }

        await queryRunner.release();

    }));

});

runIfMain(import.meta);
