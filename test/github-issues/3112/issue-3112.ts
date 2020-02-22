import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { User } from "./entity/User.ts";

describe("github issues > #3112 default:null should inserts nulls to database", () => {
    let connections: Connection[];

    before(async () => connections = await createTestingConnections({
        entities: [User],
        schemaCreate: true,
        dropSchema: true,
    }));

    beforeEach(() => reloadTestingDatabases(connections));

    after(() => closeTestingConnections(connections));


    it("should insert null when no value specified", () => Promise.all(connections.map(async connection => {
        const UserRepository = connection.manager.getRepository(User);

        const user1 = new User();

        await UserRepository.save(user1);
        const loadedUser = await UserRepository.find();

        expect(loadedUser[0].first).to.be.null;
        expect(loadedUser[0].second).to.be.null;

    })));


});

runIfMain(import.meta);
