import { join as joinPaths } from "../../../vendor/https/deno.land/std/path/mod.ts";
import { runIfMain } from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { EntitySchema } from "../../../src/index.ts";
import { Author, AuthorSchema } from "./entity/Author.ts";
import { Post, PostSchema } from "./entity/Post.ts";

describe("github issues > #1308 Raw Postgresql Update query result is always an empty array", () => {
  let connections: Connection[];
  before(
    async () =>
      (connections = await createTestingConnections({
        entities: [new EntitySchema<Author>(AuthorSchema), new EntitySchema<Post>(PostSchema)],
        dropSchema: true,
        enabledDrivers: ["postgres"],
      }))
  );
  beforeEach(() => reloadTestingDatabases(connections));
  after(() => closeTestingConnections(connections));

  async function prepareData(connection: Connection) {
    const author = new Author();
    author.id = 1;
    author.name = "Jane Doe";
    await connection.manager.save(author);
  }

  it("Update query returns the number of affected rows", () =>
    Promise.all(
      connections.map(async connection => {
        await prepareData(connection);

        const result1 = await connection.createQueryBuilder()
          .update(Author)
          .set({ name: "John Doe" })
          .where("name = :name", { name: "Jonas Doe" })
          .execute();

        result1.affected!.should.be.eql(0);

        const result2 = await connection.createQueryBuilder()
          .update(Author)
          .set({ name: "John Doe" })
          .where("name = :name", { name: "Jane Doe" })
          .execute();

        result2.affected!.should.be.eql(1);
      })
    ));
});

runIfMain(import.meta);
