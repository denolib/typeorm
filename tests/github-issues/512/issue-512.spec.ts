import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #512 Table name escaping in UPDATE in QueryBuilder", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should escape table name using driver's escape function in UPDATE", () => Promise.all(connections.map(async connection => {
        const driver = connection.driver;
        const queryBuilder = connection.manager.createQueryBuilder(Post, "post");
        const query = queryBuilder
            .update({
                title: "Some Title",
            })
            .getSql();

        return expect(query).toEqual(driver.escape("Posts"));
    })));

});
