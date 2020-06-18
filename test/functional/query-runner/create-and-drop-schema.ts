import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/index.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Book, Book2} from "./entity/Book.ts";
import {Faculty} from "./entity/Faculty.ts";
import {Photo} from "./entity/Photo.ts";
import {Post} from "./entity/Post.ts";
import {Student} from "./entity/Student.ts";
import {Teacher} from "./entity/Teacher.ts";

describe("query runner > create and drop schema", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Book, Book2, Faculty, Photo, Post, Student, Teacher],
            enabledDrivers: ["mssql", "postgres", "sap"],
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly create and drop schema and revert it", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        await queryRunner.createSchema("myTestSchema", true);
        let hasSchema = await queryRunner.hasSchema("myTestSchema");
        hasSchema.should.be.true;

        await queryRunner.dropSchema("myTestSchema");
        hasSchema = await queryRunner.hasSchema("myTestSchema");
        hasSchema.should.be.false;

        await queryRunner.executeMemoryDownSql();

        hasSchema = await queryRunner.hasSchema("myTestSchema");
        hasSchema.should.be.false;

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
