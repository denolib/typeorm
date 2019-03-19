import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {User} from "./entity/User";

describe("github issues > #867 result of `findAndCount` is wrong when apply `skip` and `take` option", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should work perfectly", () => Promise.all(connections.map(async connection => {
        const userRepository = connection.getRepository(User);
        const users = new Array(5).fill(0).map((n, i) => {
            const user = new User();
            user.username = `User_${i}`;
            return user;
        });
        await userRepository.save(users);
        const [ foundUsers, totalCount ] = await userRepository.findAndCount({
            skip: 1,
            take: 2,
            order: {
                username: "ASC"
            }
        });
        expect(totalCount).toEqual(5);
        expect(foundUsers).toHaveLength(2);
        expect(foundUsers[0].username).toEqual("User_1");
    })));

});
