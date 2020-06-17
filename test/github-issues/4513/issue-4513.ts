import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { User } from "./entity/User.ts";

describe("github issues > #4513 CockroachDB support for onConflict", () => {

  let connections: Connection[];
  before(async () => connections = await createTestingConnections({
    entities: [User],
    schemaCreate: true,
    dropSchema: true,
    enabledDrivers: ["cockroachdb"]
  }));
  beforeEach(() => reloadTestingDatabases(connections));
  after(() => closeTestingConnections(connections));

  it("should insert if no conflict", () => Promise.all(connections.map(async connection => {
    const user1 = new User();
    user1.name = "example";
    user1.email = "example@example.com";
    user1.age = 30;

    await connection.createQueryBuilder()
      .insert()
      .into(User)
      .values(user1)
      .execute();

    const user2 = new User();
    user2.name = "example2";
    user2.email = "example2@example.com";
    user2.age = 42;

    await connection.createQueryBuilder()
      .insert()
      .into(User)
      .values(user2)
      .onConflict(`("name", "email") DO NOTHING`)
      .execute();

    expect(await connection.manager.find(User)).to.have.lengthOf(2);
  })));

  it("should update on conflict with do update", () => Promise.all(connections.map(async connection => {
    const user1 = new User();
    user1.name = "example";
    user1.email = "example@example.com";
    user1.age = 30;

    await connection.createQueryBuilder()
      .insert()
      .into(User)
      .values(user1)
      .execute();

    const user2 = new User();
    user2.name = "example";
    user2.email = "example@example.com";
    user2.age = 42;

    await connection.createQueryBuilder()
      .insert()
      .into(User)
      .values(user2)
      .onConflict(`("name", "email") DO UPDATE SET age = EXCLUDED.age`)
      .execute();

    expect(await connection.manager.findOne(User, { name: "example", email: "example@example.com" })).to.eql({
      name: "example",
      email: "example@example.com",
      age: 42,
    });
  })));

  it("should not update on conflict with do nothing", () => Promise.all(connections.map(async connection => {
    const user1 = new User();
    user1.name = "example";
    user1.email = "example@example.com";
    user1.age = 30;

    await connection.createQueryBuilder()
      .insert()
      .into(User)
      .values(user1)
      .execute();

    const user2 = new User();
    user2.name = "example";
    user2.email = "example@example.com";
    user2.age = 42;

    await connection.createQueryBuilder()
      .insert()
      .into(User)
      .values(user2)
      .onConflict(`("name", "email") DO NOTHING`)
      .execute();

    expect(await connection.manager.findOne(User, { name: "example", email: "example@example.com" })).to.eql({
      name: "example",
      email: "example@example.com",
      age: 30,
    });
  })));

  it("should update with orUpdate", () => Promise.all(connections.map(async connection => {
    const user1 = new User();
    user1.name = "example";
    user1.email = "example@example.com";
    user1.age = 30;

    await connection.createQueryBuilder()
      .insert()
      .into(User)
      .values(user1)
      .execute();

    const user2 = new User();
    user2.name = "example";
    user2.email = "example@example.com";
    user2.age = 42;

    await connection.createQueryBuilder()
      .insert()
      .into(User)
      .values(user2)
      .orUpdate({
        conflict_target: ["name", "email"],
        overwrite: ["age"],
      })
      .execute();

    expect(await connection.manager.findOne(User, { name: "example", email: "example@example.com" })).to.eql({
      name: "example",
      email: "example@example.com",
      age: 42,
    });
  })));
});

runIfMain(import.meta);
