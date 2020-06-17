import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { Post } from "./entity/Post.ts";
//import { PostgresDriver } from "../../../src/driver/postgres/PostgresDriver.ts";

describe("github issues > #2128 skip preparePersistentValue for value functions", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["postgres", "mysql"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should be able to resolve value functions", () => Promise.all(connections.map(async connection => {

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
                meta: () => false/*connection.driver instanceof PostgresDriver*/ // TODO(uki00a) uncomment this when PostgresDriver is implemented.
                    ? `'${metaAddition}'::JSONB || meta::JSONB`
                    : `JSON_MERGE('${metaAddition}', meta)`
            })
            .where("title = :title", {
                title: "First Post"
            })
            .execute();

        const loadedPost = await connection.getRepository(Post).findOne({ title: "First Post" });

        expect(loadedPost!.meta).to.deep.equal({
             author: "John Doe",
             keywords: [
                 "important",
                 "fresh"
            ]
        });

    })));

});

runIfMain(import.meta);
