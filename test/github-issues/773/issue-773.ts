import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #773 @PrimaryGeneratedColumn not returning auto generated id from oracle database", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["oracle"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should return auto generated column", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.name = "My post";
        await connection.getRepository(Post).save(post);
        expect(post.id).to.be.not.undefined;
        expect(post.createdDate).to.be.not.undefined;
        expect(post.updatedDate).to.be.not.undefined;
    })));

});

runIfMain(import.meta);
