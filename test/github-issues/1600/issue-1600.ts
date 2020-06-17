import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";

describe("github issues > #1600 Postgres: QueryBuilder insert with Postgres array type bug", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [User],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should insert successfully using save method", () => Promise.all(connections.map(async connection => {

        const users: User[] = [];
        for (let i = 0; i < 10; i++) {
            const user = new User();
            user.names = ["user #" + i];
            users.push(user);
        }
        await connection.manager.save(users);

        const loadedUsers1 = await connection
            .createQueryBuilder(User, "user")
            .getMany();

        loadedUsers1.length.should.be.equal(10);

        const loadedUsers2 = await connection
            .createQueryBuilder(User, "user")
            .where("user.id IN (:...ids)", { ids: [1, 2, 3, 15] })
            .getMany();

        loadedUsers2.length.should.be.equal(3);

        const loadedUsers3 = await connection
            .createQueryBuilder(User, "user")
            .where("user.id = ANY(:ids)", { ids: [1, 2, 15] })
            .getMany();

        loadedUsers3.length.should.be.equal(2);
    })));

    it("should insert successfully using insert method", () => Promise.all(connections.map(async connection => {

        const users: User[] = [];
        for (let i = 0; i < 10; i++) {
            const user = new User();
            user.names = ["user #" + i];
            users.push(user);
        }

        await connection
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(users)
            .execute();

        const loadedUsers = await connection
            .createQueryBuilder(User, "user")
            .getMany();

        loadedUsers.length.should.be.equal(10);
    })));

});

runIfMain(import.meta);
