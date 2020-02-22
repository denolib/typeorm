import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #512 Table name escaping in UPDATE in QueryBuilder", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should escape table name using driver's escape function in UPDATE", () => Promise.all(connections.map(async connection => {
        const driver = connection.driver;
        const queryBuilder = connection.manager.createQueryBuilder(Post, "post");
        const query = queryBuilder
            .update({
                title: "Some Title",
            })
            .getSql();

        return query.should.deep.include(driver.escape("Posts"));
    })));

});

runIfMain(import.meta);
