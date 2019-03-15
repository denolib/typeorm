import "reflect-metadata";
import {Connection} from "../../../src";
import {
  closeTestingConnections,
  createTestingConnections,
  reloadTestingDatabases
} from "../../../test/utils/test-utils";
import {Role} from "./entity/Role";
import {User} from "./entity/User";

describe("other issues > using take with multiple primary keys", () => {
  let connections: Connection[];
  beforeAll(
    async () =>
      (connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
      }))
  );
  beforeEach(() => reloadTestingDatabases(connections));
  afterAll(() => closeTestingConnections(connections));

  test("should persist successfully and return persisted entity", () =>
    Promise.all(
      connections.map(async function(connection) {
        // generate bulk array of users with roles
        const promises: Promise<any>[] = [];
        for (let i = 1; i <= 100; i++) {
          const user = new User();
          user.id = i;
          user.name = `User ${i}`;
          user.handedness = i % 10 === 0 ? "left" : "right";
          user.roles = [];

          for (let i = 1; i <= 5; i++) {
            const role = new Role();
            role.name = "role #" + i;
            user.roles.push(role);
          }
          promises.push(connection.manager.save(user));
        }

        await Promise.all(promises);

        expect(true).toBeTruthy();

        // check if ordering by main object works correctly

        const loadedUsers1 = await connection.manager
          .createQueryBuilder(User, "user")
          .innerJoinAndSelect("user.roles", "roles")
          .take(10)
          .orderBy("user.id", "DESC")
          .getMany();

        expect(loadedUsers1).not.toBeUndefined();
        expect(loadedUsers1.length).toEqual(10);
        expect(loadedUsers1[0].id).toEqual(100);
        expect(loadedUsers1[1].id).toEqual(99);
        expect(loadedUsers1[2].id).toEqual(98);
        expect(loadedUsers1[3].id).toEqual(97);
        expect(loadedUsers1[4].id).toEqual(96);
        expect(loadedUsers1[5].id).toEqual(95);
        expect(loadedUsers1[6].id).toEqual(94);
        expect(loadedUsers1[7].id).toEqual(93);
        expect(loadedUsers1[8].id).toEqual(92);
        expect(loadedUsers1[9].id).toEqual(91);

        const lefties = await connection.manager
          .createQueryBuilder(User, "user")
          .innerJoinAndSelect("user.roles", "roles")
          .where("user.handedness = :handedness", { handedness: "left" })
          .take(5)
          .orderBy("user.id", "DESC")
          .getMany();

        expect(lefties).not.toBeUndefined();
        expect(lefties.length).toEqual(5);
        expect(lefties[0].id).toEqual(100);
        expect(lefties[1].id).toEqual(90);
        expect(lefties[2].id).toEqual(80);
        expect(lefties[3].id).toEqual(70);
        expect(lefties[4].id).toEqual(60);
        expect(lefties[0].roles.length).toEqual(5);
      })
    ));
});
