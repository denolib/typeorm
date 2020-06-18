import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/index.ts";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver.ts";
// TODO(uki00a) uncomment this when PostgresDriver is implemented.
// import {PostgresDriver} from "../../../src/driver/postgres/PostgresDriver.ts";
import {SapDriver} from "../../../src/driver/sap/SapDriver.ts";
import {SqlServerDriver} from "../../../src/driver/sqlserver/SqlServerDriver.ts";
import {ForeignKeyMetadata} from "../../../src/metadata/ForeignKeyMetadata.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";
import {Album} from "./entity/Album.ts";
import {Category} from "./entity/Category.ts";
import {Faculty} from "./entity/Faculty.ts";
import {Photo} from "./entity/Photo.ts";
import {PostVersion} from "./entity/PostVersion.ts";
import {Question} from "./entity/Question.ts";
import {Student} from "./entity/Student.ts";
import {Teacher} from "./entity/Teacher.ts";

describe("schema builder > custom-db-and-schema-sync", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Post, Album, Category, Faculty, Photo, PostVersion, Question, Student, Teacher],
            enabledDrivers: ["mysql", "mssql", "postgres", "sap"],
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly sync tables with custom schema and database", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        const photoMetadata = connection.getMetadata("photo");
        const albumMetadata = connection.getMetadata("album");

        // create tables
        photoMetadata.synchronize = true;
        albumMetadata.synchronize = true;

        if (connection.driver instanceof SqlServerDriver) {
            photoMetadata.database = "secondDB";
            photoMetadata.schema = "photo-schema";
            photoMetadata.tablePath = "secondDB.photo-schema.photo";
            photoMetadata.schemaPath = "secondDB.photo-schema";

            albumMetadata.database = "secondDB";
            albumMetadata.schema = "album-schema";
            albumMetadata.tablePath = "secondDB.album-schema.album";
            albumMetadata.schemaPath = "secondDB.album-schema";

            await queryRunner.createDatabase(photoMetadata.database, true);
            await queryRunner.createSchema(photoMetadata.schemaPath, true);
            await queryRunner.createSchema(albumMetadata.schemaPath, true);

        } else if (/*connection.driver instanceof PostgresDriver || */connection.driver instanceof SapDriver) { // TODO(uki00a) uncomment this when PostgresDriver is implemented.
            photoMetadata.schema = "photo-schema";
            photoMetadata.tablePath = "photo-schema.photo";
            photoMetadata.schemaPath = "photo-schema";

            albumMetadata.schema = "album-schema";
            albumMetadata.tablePath = "album-schema.album";
            albumMetadata.schemaPath = "album-schema";
            await queryRunner.createSchema(photoMetadata.schemaPath, true);
            await queryRunner.createSchema(albumMetadata.schemaPath, true);

        } else if (connection.driver instanceof MysqlDriver) {
            photoMetadata.database = "secondDB";
            photoMetadata.tablePath = "secondDB.photo";

            albumMetadata.database = "secondDB";
            albumMetadata.tablePath = "secondDB.album";

            await queryRunner.createDatabase(photoMetadata.database, true);
        }

        await connection.synchronize();

        // create foreign key
        let albumTable = await queryRunner.getTable(albumMetadata.tablePath);
        let photoTable = await queryRunner.getTable(photoMetadata.tablePath);
        albumTable!.should.be.exist;
        photoTable!.should.be.exist;

        const columns = photoMetadata.columns.filter(column => column.propertyName === "albumId");
        const referencedColumns = albumMetadata.columns.filter(column => column.propertyName === "id");
        const fkMetadata = new ForeignKeyMetadata({
            entityMetadata: photoMetadata,
            referencedEntityMetadata: albumMetadata,
            columns: columns,
            referencedColumns: referencedColumns,
            namingStrategy: connection.namingStrategy
        });
        photoMetadata.foreignKeys.push(fkMetadata);

        await connection.synchronize();

        photoTable = await queryRunner.getTable(photoMetadata.tablePath);
        photoTable!.foreignKeys.length.should.be.equal(1);

        // drop foreign key
        photoMetadata.foreignKeys = [];
        await connection.synchronize();

        // drop tables manually, because they will not synchronize automatically
        await queryRunner.dropTable(photoMetadata.tablePath, true, false);
        await queryRunner.dropTable(albumMetadata.tablePath, true, false);

        // drop created database
        await queryRunner.dropDatabase("secondDB", true);

        await queryRunner.release();

    })));

});

runIfMain(import.meta);
