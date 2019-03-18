import "reflect-metadata";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../test/utils/test-utils";
import { Connection } from "../../../src";
import { Post } from "./entity/Post";
import { PostgresDriver } from "../../../src/driver/postgres/PostgresDriver";

describe("github issues > #2128 skip preparePersistentValue for value functions", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres", "mysql"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should be able to resolve value functions", () => Promise.all(connections.map(async connection => {

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values({
                title: "First Post",
                meta: {
                    keywords: [
                        "important",
                        "fresh"
                    ]
                }
            })
            .execute();

        const metaAddition = JSON.stringify({
            author: "John Doe"
        });

        await connection.createQueryBuilder()
            .update(Post)
            .set({
                meta: () => connection.driver instanceof PostgresDriver
                    ? `'${metaAddition}'::JSONB || meta::JSONB`
                    : `JSON_MERGE('${metaAddition}', meta)`
            })
            .where("title = :title", {
                title: "First Post"
            })
            .execute();

        const loadedPost = await connection.getRepository(Post).findOne({ title: "First Post" });

        expect(loadedPost!.meta).toEqual({
            author: "John Doe",
            keywords: [
                "important",
                "fresh"
            ]
        });
    })));

});
