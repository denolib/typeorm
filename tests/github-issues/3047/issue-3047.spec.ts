import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {User} from "./entity/User";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver";
import {PostgresDriver} from "../../../src/driver/postgres/PostgresDriver";

describe("github issues > #3047 Mysqsl on duplicate key update use current values", () => {
    let connections: Connection[];

    beforeAll(async () => connections = await createTestingConnections({
        entities: [User],
        schemaCreate: true,
        dropSchema: true,
    }));

    beforeEach(() => reloadTestingDatabases(connections));

    afterAll(() => closeTestingConnections(connections));

    let user1 = new User();
    user1.first_name = "John";
    user1.last_name = "Lenon";
    user1.is_updated = "no";

    let user2 = new User();
    user2.first_name = "John";
    user2.last_name = "Lenon";
    user2.is_updated = "yes";

    test("should overwrite using current value in MySQL/MariaDB", () => Promise.all(connections.map(async connection => {
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
            expect(loadedUser).not.toBeUndefined();
            expect(loadedUser).toHaveLength(1);
            expect(loadedUser[0]).toEqual({ is_updated: "yes" });
        }
      } catch (err) {
        throw new Error(err);
      }
     })));

    test("should overwrite using current value in PostgreSQL", () => Promise.all(connections.map(async connection => {
      try {
        if (connection.driver instanceof PostgresDriver) {

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
          expect(loadedUser).not.toBeUndefined();
          expect(loadedUser).toHaveLength(1);
          expect(loadedUser[0]).toEqual({ is_updated: "yes" });
        }
      } catch (err) {
        throw new Error(err);
      }
    })));
 });
