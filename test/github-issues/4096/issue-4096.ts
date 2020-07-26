import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";

describe("github issues > #4096 SQLite support for orUpdate", () => {
    let connections: Connection[];

    before(async () => connections = await createTestingConnections({
        entities: [User],
        enabledDrivers: ["sqlite"],
        schemaCreate: true,
        dropSchema: true,
    }));

    beforeEach(() => reloadTestingDatabases(connections));

    after(() => closeTestingConnections(connections));

    it("should overwrite using current value in SQLite", () => Promise.all(connections.map(async connection => {
      const user1 = new User();
      user1.email = "example@example.org";
      user1.username = "example";
      user1.bio = "My bio";

      const user2 = new User();
      user2.email = "example@example.org";
      user2.username = "example";
      user2.bio = "Updated bio";

      const UserRepository = connection.manager.getRepository(User);

      await UserRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user1)
        .execute();

      await UserRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user2)
        .orUpdate({
          conflict_target: [ "email", "username" ],
          overwrite: ["bio"],
        })
        .execute();

      const users = await UserRepository.find();
      expect(users).not.to.be.undefined;
      expect(users).to.have.lengthOf(1);
      expect(users[0]).to.includes({ bio: "Updated bio" });
    })));
 });

runIfMain(import.meta);
