import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #4842 QueryExpressionMap doesn't clone distinct property", () => {
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should contain correct distinct value after query builder is cloned", () => Promise.all(connections.map(async connection => {
      const query = connection.manager.createQueryBuilder(Post, "post")
          .distinct()
          .disableEscaping();
        const sqlWithDistinct = query.getSql();

        expect(query.clone().getSql()).to.equal(sqlWithDistinct);
    })));
});

runIfMain(import.meta);
