import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {EntitySchema} from "../../../src";
import {Author, AuthorSchema} from "./entity/Author";
import {Post, PostSchema} from "./entity/Post";

describe("github issues > #1123 load relation eagerly by setting isEager property", () => {
  let connections: Connection[];
  beforeAll(
    async () =>
      (connections = await createTestingConnections({
        entities: [new EntitySchema<Author>(AuthorSchema), new EntitySchema<Post>(PostSchema)],
        dropSchema: true
      }))
  );
  beforeEach(() => reloadTestingDatabases(connections));
  afterAll(() => closeTestingConnections(connections));

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

  test("should load all eager relations when object is loaded", () =>
    Promise.all(
      connections.map(async connection => {
        await prepareData(connection);

        const loadedPost = await connection.manager.findOne(Post, 1);
        expect(loadedPost)!.toEqual({
          id: 1,
          title: "Post 1",
          author: {
            id: 1,
            name: "Jane Doe"
          }
        });
      })
    ));

  test("should not load eager relations when query builder is used", () =>
    Promise.all(
      connections.map(async connection => {
        await prepareData(connection);

        const loadedPost = await connection.manager
          .createQueryBuilder("Post", "post")
          .where("post.id = :id", { id: 1 })
          .getOne();

        expect(loadedPost)!.toEqual({
          id: 1,
          title: "Post 1"
        });
      })
    ));
});
