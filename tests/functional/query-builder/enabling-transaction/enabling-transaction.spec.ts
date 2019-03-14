import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";

describe("query builder > enabling transaction", () => {
    
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({ __dirname }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should execute query in a transaction", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about transactions in query builder";

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values(post)
            .useTransaction(true)
            .execute();

        // todo: check if transaction query was executed

    })));

    // todo: add tests for update and remove queries as well

});
