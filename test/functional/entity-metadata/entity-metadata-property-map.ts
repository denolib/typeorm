import {Post} from "./entity/Post.ts";
import {Counters} from "./entity/Counters.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {expect} from "../../deps/chai.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Subcounters} from "./entity/Subcounters.ts";
import {User} from "./entity/User.ts";

describe("entity-metadata > property-map", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Counters, Post, Subcounters, User],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should create correct property map object", () => Promise.all(connections.map(async connection => {

        const user1 = new User();
        user1.id = 1;
        user1.name = "Alice";

        const post1 = new Post();
        post1.title = "About cars";
        post1.counters = new Counters();
        post1.counters.code = 1;
        post1.counters.comments = 1;
        post1.counters.favorites = 2;
        post1.counters.likes = 3;
        post1.counters.likedUsers = [user1];
        post1.counters.subcounters = new Subcounters();
        post1.counters.subcounters.version = 1;
        post1.counters.subcounters.watches = 5;
        post1.counters.subcounters.watchedUsers = [user1];

        const postPropertiesMap = connection.getMetadata(Post).propertiesMap;
        expect(postPropertiesMap.should.be.eql(
            {
                id: "id",
                title: "title",
                counters:  {
                    code: "counters.code",
                    likes: "counters.likes",
                    comments: "counters.comments",
                    favorites: "counters.favorites",
                    subcounters: {
                        version: "counters.subcounters.version",
                        watches: "counters.subcounters.watches",
                        watchedUsers: "counters.subcounters.watchedUsers"
                    },
                    likedUsers: "counters.likedUsers"
                }
            }
        ));
    })));
});

runIfMain(import.meta);
