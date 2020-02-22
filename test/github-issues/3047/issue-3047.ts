import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver.ts";
// import {PostgresDriver} from "../../../src/driver/postgres/PostgresDriver.ts";

describe("github issues > #3047 Mysqsl on duplicate key update use current values", () => {
    let connections: Connection[];

    before(async () => connections = await createTestingConnections({
        entities: [User],
        schemaCreate: true,
        dropSchema: true,
    }));

    beforeEach(() => reloadTestingDatabases(connections));

    after(() => closeTestingConnections(connections));

    let user1 = new User();
    user1.first_name = "John";
    user1.last_name = "Lenon";
    user1.is_updated = "no";

    let user2 = new User();
    user2.first_name = "John";
    user2.last_name = "Lenon";
    user2.is_updated = "yes";

    it("should overwrite using current value in MySQL/MariaDB", () => Promise.all(connections.map(async connection => {
      try {
         if (connection.driver instanceof MysqlDriver) {
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
              .orUpdate({ overwrite: ["is_updated"]})
              .execute();

            let loadedUser = await UserRepository.find();
            expect(loadedUser).not.to.be.undefined;
            expect(loadedUser).to.have.lengthOf(1);
            expect(loadedUser[0]).to.includes({ is_updated: "yes" });
        }
      } catch (err) {
        throw new Error(err);
      }
     })));

    it("should overwrite using current value in PostgreSQL", () => Promise.all(connections.map(async connection => {
      try {
        if (false/*connection.driver instanceof PostgresDriver*/) { // TODO(uki00a) uncomment this when PostgresDriver is implemeted.

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
              conflict_target: [ "first_name", "last_name" ],
              overwrite: ["is_updated"],
            })
            .execute();

          let loadedUser = await UserRepository.find();
          expect(loadedUser).not.to.be.undefined;
          expect(loadedUser).to.have.lengthOf(1);
          expect(loadedUser[0]).to.includes({ is_updated: "yes" });
        }
      } catch (err) {
        throw new Error(err);
      }
    })));
 });

runIfMain(import.meta);
