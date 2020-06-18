import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";
import {Brackets} from "../../../../src/query-builder/Brackets.ts";

describe("query builder > brackets", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [User],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should put brackets correctly into WHERE expression", () => Promise.all(connections.map(async connection => {

        const user1 = new User();
        user1.firstName = "Timber";
        user1.lastName = "Saw";
        user1.isAdmin = false;
        await connection.manager.save(user1);

        const user2 = new User();
        user2.firstName = "Alex";
        user2.lastName = "Messer";
        user2.isAdmin = false;
        await connection.manager.save(user2);

        const user3 = new User();
        user3.firstName = "Umed";
        user3.lastName = "Pleerock";
        user3.isAdmin = true;
        await connection.manager.save(user3);

        const users = await connection.createQueryBuilder(User, "user")
            .where("user.isAdmin = :isAdmin", { isAdmin: true })
            .orWhere(new Brackets(qb => {
                qb.where("user.firstName = :firstName1", { firstName1: "Timber" })
                    .andWhere("user.lastName = :lastName1", { lastName1: "Saw" });
            }))
            .orWhere(new Brackets(qb => {
                qb.where("user.firstName = :firstName2", { firstName2: "Alex" })
                    .andWhere("user.lastName = :lastName2", { lastName2: "Messer" });
            }))
            .getMany();

        expect(users.length).to.be.equal(3);

    })));

});

runIfMain(import.meta);
