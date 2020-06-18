import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
export type Role = "sa" | "user" | "admin" | "server";
import {User} from "./entity/user.ts";

describe("github issues > #953 MySQL 5.7 JSON column parse", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [User],
        enabledDrivers: ["mysql"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should retrieve record from mysql5.7 using driver mysql2", () => Promise.all(connections.map(async connection => {
        const repo = connection.getRepository(User);
        let newUser = new User();
        newUser.username = "admin";
        newUser.password = "admin";
        newUser.roles = ["admin"];
        newUser.lastLoginAt = new Date();
        let user = repo.create(newUser);
        await repo.save(user);

        let user1 = await repo.findOne({username: "admin"});
        expect(user1).has.property("roles").with.is.an("array").and.contains("admin");
    })));

});

runIfMain(import.meta);
