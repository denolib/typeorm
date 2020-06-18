import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver.ts";
import {UniqueMetadata} from "../../../src/metadata/UniqueMetadata.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {ForeignKeyMetadata} from "../../../src/metadata/ForeignKeyMetadata.ts";
import {Post} from "./entity/Post.ts";
import {Album} from "./entity/Album.ts";
import {Category} from "./entity/Category.ts";
import {Faculty} from "./entity/Faculty.ts";
import {Photo} from "./entity/Photo.ts";
import {PostVersion} from "./entity/PostVersion.ts";
import {Question} from "./entity/Question.ts";
import {Student} from "./entity/Student.ts";
import {Teacher} from "./entity/Teacher.ts";

describe("schema builder > create foreign key", () => {

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

    it("should correctly create foreign key", () => Promise.all(connections.map(async connection => {
        const categoryMetadata = connection.getMetadata("category");
        const postMetadata = connection.getMetadata("post");
        const columns = categoryMetadata.columns.filter(column => ["postText", "postTag"].indexOf(column.propertyName) !== -1);
        const referencedColumns = postMetadata.columns.filter(column => ["text", "tag"].indexOf(column.propertyName) !== -1);

        const fkMetadata = new ForeignKeyMetadata({
            entityMetadata: categoryMetadata,
            referencedEntityMetadata: postMetadata,
            columns: columns,
            referencedColumns: referencedColumns,
            namingStrategy: connection.namingStrategy
        });
        categoryMetadata.foreignKeys.push(fkMetadata);

        // CockroachDB requires unique constraint for foreign key referenced columns
        if (false/*connection.driver instanceof CockroachDriver*/) { // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            const uniqueConstraint = new UniqueMetadata({
                entityMetadata: categoryMetadata,
                columns: fkMetadata.columns,
                args: {
                    name: connection.namingStrategy.relationConstraintName(categoryMetadata.tablePath, fkMetadata.columns.map(c => c.databaseName)),
                    target: categoryMetadata.target,
                }
            });
            categoryMetadata.uniques.push(uniqueConstraint);
        }

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("category");
        await queryRunner.release();

        table!.foreignKeys.length.should.be.equal(1);
        table!.indices.length.should.be.equal(0);

    })));

});

runIfMain(import.meta);
