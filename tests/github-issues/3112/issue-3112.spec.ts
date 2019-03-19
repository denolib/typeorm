import "reflect-metadata";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils";
import { Connection } from "../../../src";
import { User } from "./entity/User";

describe("github issues > #3112 default:null should inserts nulls to database", () => {
    let connections: Connection[];

    beforeAll(async () => connections = await createTestingConnections({
        entities: [User],
        schemaCreate: true,
        dropSchema: true,
    }));

    beforeEach(() => reloadTestingDatabases(connections));

    afterAll(() => closeTestingConnections(connections));


    test("should insert null when no value specified", () => Promise.all(connections.map(async connection => {
        const UserRepository = connection.manager.getRepository(User);

        const user1 = new User();

        await UserRepository.save(user1);
        const loadedUser = await UserRepository.find();

        expect(loadedUser[0].first).toBeNull();
        expect(loadedUser[0].second).toBeNull();

    })));


});
