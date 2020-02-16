import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver.ts";
import {UniqueMetadata} from "../../../src/metadata/UniqueMetadata.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {ForeignKeyMetadata} from "../../../src/metadata/ForeignKeyMetadata.ts";

describe("schema builder > create foreign key", () => {

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
