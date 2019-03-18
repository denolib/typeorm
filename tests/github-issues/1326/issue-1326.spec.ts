import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {User} from "./entity/User";
import {SpecificUser} from "./entity/SpecificUser";
import {Connection} from "../../../src";

describe("github issue > #1326 Wrong behavior w/ the same table names in different databases", () => {

    let connections: Connection[] = [];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not confuse equivalent table names in different databases", () => Promise.all(connections.map(async connection => {
        for (let i = 1; i <= 10; i++) {
            const user = new User();
            user.name = "user #" + i;
            await connection.manager.save(user);
        }
        for (let i = 1; i <= 10; i++) {
            const user = new SpecificUser();
            user.name = "specific user #" + i;
            await connection.manager.save(user);
        }

        const user = await connection.manager.findOne(User, { name: "user #1" });
        expect(user).not.toBeUndefined();
        expect(user)!.toEqual({
            id: 1,
            name: "user #1"
        });

        const specificUser = await connection.manager.findOne(SpecificUser, { name: "specific user #1" });
        expect(specificUser).not.toBeUndefined();
        expect(specificUser)!.toEqual({
            id: 1,
            name: "specific user #1"
        });
    })));

});
