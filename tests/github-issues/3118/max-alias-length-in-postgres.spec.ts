import "reflect-metadata";
import { Connection } from "../../../src";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../test/utils/test-utils";
import { CategoryWithVeryLongName } from "./entity/CategoryWithVeryLongName";
import { AuthorWithVeryLongName as PostAuthorWithVeryLongName, AuthorWithVeryLongName } from "./entity/PostAuthorWithVeryLongName";
import { PostWithVeryLongName } from "./entity/PostWithVeryLongName";

/**
 * @see https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS
 * "The system uses no more than NAMEDATALEN-1 bytes of an identifier; longer names can be
 * written in commands, but they will be truncated. By default, NAMEDATALEN is 64 so the
 * maximum identifier length is 63 bytes. If this limit is problematic, it can be raised
 * by changing the NAMEDATALEN constant in src/include/pg_config_manual.h."
 */
describe("other issues > shorten alias names (for RDBMS with a limit) when they are longer than 63 characters", () => {
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should be able to load deeply nested entity, even with long aliases", () => Promise.all(connections.map(async (connection) => {
        const author = new PostAuthorWithVeryLongName();
        author.firstName = "Jean";
        const post = new PostWithVeryLongName();
        post.authorWithVeryLongName = author;
        const category = new CategoryWithVeryLongName();
        category.postsWithVeryLongName = category.postsWithVeryLongName || [];
        category.postsWithVeryLongName.push(post);

        await connection.getRepository(AuthorWithVeryLongName).save(author);
        await connection.getRepository(PostWithVeryLongName).save(post);
        await connection.getRepository(CategoryWithVeryLongName).save(category);

        const loadedCategory = await connection.manager.findOne(CategoryWithVeryLongName, { relations: [
            "postsWithVeryLongName",
            // before: used to generate an "AS" alias like `CategoryWithVeryLongName__postsWithVeryLongName__authorWithVeryLongName_firstName`
            // now: "CaWiVeLoNa__poWiVeLoNa__auWiVeLoNa_firstName", which is acceptable by Postgres (limit to 63 characters)
            "postsWithVeryLongName.authorWithVeryLongName"
        ] });

        expect(loadedCategory).not.toBeUndefined();
        expect(loadedCategory!.postsWithVeryLongName).not.toBeUndefined();
        expect(loadedCategory!.postsWithVeryLongName).toBeDefined();
        expect(loadedCategory!.postsWithVeryLongName[0].authorWithVeryLongName).not.toBeUndefined();
        expect(loadedCategory!.postsWithVeryLongName[0].authorWithVeryLongName.firstName).toEqual(author.firstName);
    })));

    test("should shorten table names which exceed the max length", () => Promise.all(connections.map(async (connection) => {
        const shortName = "cat_wit_ver_lon_nam_pos_wit_ver_lon_nam_pos_wit_ver_lon_nam";
        const normalName = "category_with_very_long_name_posts_with_very_long_name_post_with_very_long_name";
        const { maxAliasLength } = connection.driver;
        const expectedTableName =  maxAliasLength && maxAliasLength > 0 && normalName.length > maxAliasLength ? shortName : normalName;

        expect(connection.entityMetadatas.some(em => em.tableName === expectedTableName)).toBeTruthy();
    })));
});
