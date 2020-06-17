import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { closeTestingConnections, createTestingConnections } from "../../utils/test-utils.ts";
import { Post } from "./entity/Post.ts";
import { Role } from "./set.ts";

describe("github issues > #2779 Could we add support for the MySQL/MariaDB SET data type?", () => {

  let connections: Connection[];
  before(async () => {
    connections = await createTestingConnections({
      entities: [Post],
      enabledDrivers: ["mariadb", "mysql"],
      schemaCreate: true,
      dropSchema: true,
    });
  });
  after(() => closeTestingConnections(connections));

  it("should create column with SET datatype", () => Promise.all(connections.map(async connection => {

    const queryRunner = connection.createQueryRunner();
    const table = await queryRunner.getTable("post");
    table!.findColumnByName("roles")!.type.should.be.equal("set");
    await queryRunner.release();

  })));

  it("should persist and hydrate sets", () => Promise.all(connections.map(async connection => {

    const targetValue = [Role.Support, Role.Developer];

    const post = new Post();
    post.roles = targetValue;
    await connection.manager.save(post);
    post.roles.should.be.deep.equal(targetValue);

    const loadedPost = await connection.manager.findOne(Post);
    expect(loadedPost).not.to.be.undefined;
    loadedPost!.roles.should.be.deep.equal(targetValue);
  })));

});

runIfMain(import.meta);
