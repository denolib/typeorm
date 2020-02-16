import {Connection} from "../../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";
import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {SqlServerDriver} from "../../../../src/driver/sqlserver/SqlServerDriver.ts";

describe("multi-schema-and-database > custom-junction-database", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Post, Category],
            enabledDrivers: ["mysql"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly create tables when custom table schema used", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        if (connection.driver instanceof SqlServerDriver) {
            const postTable = await queryRunner.getTable("yoman..post");
            const categoryTable = await queryRunner.getTable("yoman..category");
            const junctionMetadata = connection.getManyToManyMetadata(Post, "categories")!;
            const junctionTable = await queryRunner.getTable("yoman.." + junctionMetadata.tableName);
            expect(postTable).not.to.be.undefined;
            postTable!.name!.should.be.equal("yoman..post");
            expect(categoryTable).not.to.be.undefined;
            categoryTable!.name!.should.be.equal("yoman..category");
            expect(junctionTable).not.to.be.undefined;
            junctionTable!.name!.should.be.equal("yoman.." + junctionMetadata.tableName);

        } else { // mysql
            const postTable = await queryRunner.getTable("yoman.post");
            const categoryTable = await queryRunner.getTable("yoman.category");
            const junctionMetadata = connection.getManyToManyMetadata(Post, "categories")!;
            const junctionTable = await queryRunner.getTable("yoman." + junctionMetadata.tableName);
            expect(postTable).not.to.be.undefined;
            postTable!.name!.should.be.equal("yoman.post");
            expect(categoryTable).not.to.be.undefined;
            categoryTable!.name!.should.be.equal("yoman.category");
            expect(junctionTable).not.to.be.undefined;
            junctionTable!.name!.should.be.equal("yoman." + junctionMetadata.tableName);
        }
        await queryRunner.release();
    })));

});

runIfMain(import.meta);
