import { Connection } from "../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../test/utils/test-utils";
import { User } from "./entity/User";

describe("github issues > #3654 Should be able compare buffer type", () => {
    let connections: Connection[];
    beforeAll(
        async () =>
            (connections = await createTestingConnections({
                entities: [__dirname + "/entity/*{.js,.ts}"],
                enabledDrivers: ["mysql"]
            }))
    );
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("Repository.save() method should be able compare buffer type for deciding if save or update ops.", () =>
        Promise.all(
            connections.map(async connection => {
                const userRepo = connection.getRepository(User);

                let userId = "4321226123455910A532153E57A78445".toLowerCase();

                const user = new User();
                user.id = userId;
                user.age = 25;
                await userRepo.save(user);

                const dbUser = (await userRepo.find({
                    where: {
                        id: Buffer.from(userId, "hex")
                    }
                }))[0];

                dbUser.age = 26;
                await userRepo.save(dbUser);

                const confirmUser = (await userRepo.find({
                    where: {
                        id: Buffer.from(userId, "hex")
                    }
                }))[0];

                expect(confirmUser.id).toEqual(userId);
                expect(confirmUser.age).toEqual(26);
            })
        ));
});
