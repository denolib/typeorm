import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {EntitySchema, In} from "../../../src/index.ts";
import {Author, AuthorSchema} from "./entity/Author.ts";
import {Post, PostSchema} from "./entity/Post.ts";

describe("github issues > #4156 QueryExpressionMap doesn't clone all values correctly", () => {
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

    const post = new Post();
    post.id = 1;
    post.title = "Post 1";
    post.author = author;
    await connection.manager.save(post);
  }

  it("should not error when the query builder has been cloned", () =>
    Promise.all(
      connections.map(async connection => {
        await prepareData(connection);

        const qb = connection.manager
          .createQueryBuilder("Post", "post");

        const [loadedPost1, loadedPost2] = await Promise.all([
          qb.clone().where({ id: 1 }).getOne(),
          qb.clone().where({ id: In([1]) }).getOne(),
        ]);

        loadedPost1!.should.be.eql({
          id: 1,
          title: "Post 1"
        });

        loadedPost2!.should.be.eql({
          id: 1,
          title: "Post 1"
        });
      })
    ));

  it("should not error when the query builder with where statement has been cloned", () =>
    Promise.all(
      connections.map(async connection => {
        await prepareData(connection);

        const qb = connection.manager
          .createQueryBuilder("Post", "post")
          .where({ id: 1 });

        const [loadedPost1, loadedPost2] = await Promise.all([
          qb.clone().getOne(),
          qb.clone().getOne(),
        ]);

        loadedPost1!.should.be.eql({
          id: 1,
          title: "Post 1"
        });

        loadedPost2!.should.be.eql({
          id: 1,
          title: "Post 1"
        });
      })
    ));
});

runIfMain(import.meta);
