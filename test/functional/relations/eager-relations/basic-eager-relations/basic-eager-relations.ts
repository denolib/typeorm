import {runIfMain} from "../../../../deps/mocha.ts";
import "../../../../deps/chai.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {User} from "./entity/User.ts";
import {Profile} from "./entity/Profile.ts";
import {Editor} from "./entity/Editor.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("relations > eager relations > basic", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Editor, Post, Profile, User],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    async function prepareData(connection: Connection) {
        const profile = new Profile();
        profile.about = "I cut trees!";
        await connection.manager.save(profile);

        const user = new User();
        user.firstName = "Timber";
        user.lastName = "Saw";
        user.profile = profile;
        await connection.manager.save(user);

        const primaryCategory1 = new Category();
        primaryCategory1.name = "primary category #1";
        await connection.manager.save(primaryCategory1);

        const primaryCategory2 = new Category();
        primaryCategory2.name = "primary category #2";
        await connection.manager.save(primaryCategory2);

        const secondaryCategory1 = new Category();
        secondaryCategory1.name = "secondary category #1";
        await connection.manager.save(secondaryCategory1);

        const secondaryCategory2 = new Category();
        secondaryCategory2.name = "secondary category #2";
        await connection.manager.save(secondaryCategory2);

        const post = new Post();
        post.title = "about eager relations";
        post.categories1 = [primaryCategory1, primaryCategory2];
        post.categories2 = [secondaryCategory1, secondaryCategory2];
        post.author = user;
        await connection.manager.save(post);

        const editor = new Editor();
        editor.post = post;
        editor.user = user;
        await connection.manager.save(editor);
    }

    it("should load all eager relations when object is loaded", () => Promise.all(connections.map(async connection => {
        await prepareData(connection);

        const loadedPost = await connection.manager.findOne(Post, 1);
        loadedPost!.should.be.eql({
            id: 1,
            title: "about eager relations",
            categories1: [{
                id: 1,
                name: "primary category #1"
            }, {
                id: 2,
                name: "primary category #2"
            }],
            categories2: [{
                id: 3,
                name: "secondary category #1"
            }, {
                id: 4,
                name: "secondary category #2"
            }],
            author: {
                id: 1,
                firstName: "Timber",
                lastName: "Saw",
                profile: {
                    id: 1,
                    about: "I cut trees!"
                }
            },
            editors: [{
                user: {
                    id: 1,
                    firstName: "Timber",
                    lastName: "Saw",
                    profile: {
                        id: 1,
                        about: "I cut trees!"
                    }
                }
            }]
        });

    })));

    it("should not load eager relations when query builder is used", () => Promise.all(connections.map(async connection => {
        await prepareData(connection);

        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();

        loadedPost!.should.be.eql({
            id: 1,
            title: "about eager relations"
        });
    })));

});

runIfMain(import.meta);
