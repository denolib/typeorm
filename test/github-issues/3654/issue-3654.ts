import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import { Connection } from "../../../src/index.ts";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../utils/test-utils.ts";
import { User } from "./entity/User.ts";

// TODO(uki00a) This suite is skipped because it depends on `string_decoder` module.
describe.skip("github issues > #3654 Should be able compare buffer type", () => {
    let connections: Connection[];
    before(
        async () =>
            (connections = await createTestingConnections({
                entities: [User],
                enabledDrivers: ["mysql"]
            }))
    );
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("Repository.save() method should be able compare buffer type for deciding if save or update ops.", () =>
        Promise.all(
            connections.map(async connection => {
                const userRepo = connection.getRepository(User);
                const encoder = new TextEncoder();

                let userId = "4321226123455910A532153E57A78445".toLowerCase();

                const user = new User();
                user.id = userId;
                user.age = 25;
                await userRepo.save(user);

                const dbUser = (await userRepo.find({
                    where: {
                        id: encoder.encode(userId)//Buffer.from(userId, "hex")
                    }
                }))[0];

                dbUser.age = 26;
                await userRepo.save(dbUser);

                const confirmUser = (await userRepo.find({
                    where: {
                        id: encoder.encode(userId)//Buffer.from(userId, "hex")
                    }
                }))[0];

                confirmUser.id.should.be.eql(userId);
                confirmUser.age.should.be.eql(26);
            })
        ));
});

runIfMain(import.meta);
