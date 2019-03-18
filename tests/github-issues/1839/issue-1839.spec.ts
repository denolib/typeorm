import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";

describe("github issues > #1839 Charset and collation not being carried to JoinTable when generating migration", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should carry charset and collation from original column in to junction column", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post_categories_category");
        expect(table!.findColumnByName("postId")!.charset)!.toEqual("utf8");
        expect(table!.findColumnByName("postId")!.collation)!.toEqual("utf8_unicode_ci");
        expect(table!.findColumnByName("categoryId")!.charset)!.toEqual("ascii");
        expect(table!.findColumnByName("categoryId")!.collation)!.toEqual("ascii_general_ci");
        await queryRunner.release();
    })));

});
