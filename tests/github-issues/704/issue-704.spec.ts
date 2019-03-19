import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {User} from "./entity/User";

describe("github issues > #704 Table alias in WHERE clause is not quoted in PostgreSQL", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should return user by a given email and proper escape 'user' keyword", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.email = "john@example.com";
        await connection.manager.save(user);

        const loadedUser = await connection.getRepository(User).findOne({ email: "john@example.com" });

        expect(loadedUser!.id).toEqual(1);
        expect(loadedUser!.email).toEqual("john@example.com");
    })));

});
