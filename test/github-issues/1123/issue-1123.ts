import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {EntitySchema} from "../../../src/index.ts";
import {Author, AuthorSchema} from "./entity/Author.ts";
import {Post, PostSchema} from "./entity/Post.ts";

describe("github issues > #1123 load relation eagerly by setting isEager property", () => {
  let connections: Connection[];
  before(
    async () =>
      (connections = await createTestingConnections({
        entities: [new EntitySchema<Author>(AuthorSchema), new EntitySchema<Post>(PostSchema)],
        dropSchema: true
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

  it("should load all eager relations when object is loaded", () =>
    Promise.all(
      connections.map(async connection => {
        await prepareData(connection);

        const loadedPost = await connection.manager.findOne(Post, 1);
        loadedPost!.should.be.eql({
          id: 1,
          title: "Post 1",
          author: {
            id: 1,
            name: "Jane Doe"
          }
        });
      })
    ));

  it("should not load eager relations when query builder is used", () =>
    Promise.all(
      connections.map(async connection => {
        await prepareData(connection);

        const loadedPost = await connection.manager
          .createQueryBuilder("Post", "post")
          .where("post.id = :id", { id: 1 })
          .getOne() as Post;

        loadedPost!.should.be.eql({
          id: 1,
          title: "Post 1"
        });
      })
    ));
});

runIfMain(import.meta);
