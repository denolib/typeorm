import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";
import {UserCredential} from "./entity/UserCredential.ts";

describe("github issues > #836 .save won't update entity when it contains OneToOne relationship", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [User, UserCredential],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work perfectly", () => Promise.all(connections.map(async connection => {

        // just insert another dummy user
        const user1 = new User();
        user1.email = "user1@user.com";
        user1.username = "User 1";
        user1.privilege = 0;
        await connection.manager.save(user1);

        // create a user but do not insert it
        const user2 = new User();
        user2.email = "user2@user.com";
        user2.username = "User 2";
        user2.privilege = 0;

        // now create credentials and let user to be saved by cascades
        const credential = new UserCredential();
        credential.password = "ABC";
        credential.salt = "CDE";
        credential.user = user2;
        await connection.manager.save(credential);

        // check if credentials and user are saved properly
        const loadedCredentials = await connection.manager.findOne(UserCredential, 2, { relations: ["user"] });
        loadedCredentials!.should.be.eql({
            user: {
                id: 2,
                email: "user2@user.com",
                username: "User 2",
                privilege: 0
            },
            password: "ABC",
            salt: "CDE"
        });

    })));

});

runIfMain(import.meta);
