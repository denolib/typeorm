import "reflect-metadata";
import {Connection, EntityManager} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {FindOptionsBuilder} from "../../../../src/find-options/FindOptionsBuilder";
import {Post} from "./entity/Post";
import {Author} from "./entity/Author";
import {Photo} from "./entity/Photo";
import {Tag} from "./entity/Tag";
import {Counters} from "./entity/Counters";

describe.only("find options > where", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        __dirname,
        enabledDrivers: ["sqlite"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    async function prepareData(manager: EntityManager) {

        const photo1 = new Photo();
        photo1.filename = "chain.jpg";
        photo1.description = "Me and chain";
        await manager.save(photo1);

        const photo2 = new Photo();
        photo2.filename = "saw.jpg";
        photo2.description = "Me and saw";
        await manager.save(photo2);

        const user1 = new Author();
        user1.firstName = "Timber";
        user1.lastName = "Saw";
        user1.age = 25;
        user1.photos = [photo1, photo2];
        await manager.save(user1);

        const user2 = new Author();
        user2.firstName = "Gyro";
        user2.lastName = "Copter";
        user2.age = 52;
        user2.photos = [];
        await manager.save(user2);

        const tag1 = new Tag();
        tag1.name = "category #1";
        await manager.save(tag1);

        const tag2 = new Tag();
        tag2.name = "category #2";
        await manager.save(tag2);

        const tag3 = new Tag();
        tag3.name = "category #3";
        await manager.save(tag3);

        const post1 = new Post();
        post1.title = "Post #1";
        post1.text = "About post #1";
        post1.author = user1;
        post1.tags = [tag1, tag2];
        post1.counters = new Counters();
        post1.counters.likes = 1;
        post1.counters.likedUsers = [user1];
        await manager.save(post1);

        const post2 = new Post();
        post2.title = "Post #2";
        post2.text = "About post #2";
        post2.author = user1;
        post2.tags = [tag2];
        post2.counters = new Counters();
        post2.counters.likes = 2;
        post2.counters.likedUsers = [user1, user2];
        await manager.save(post2);

        const post3 = new Post();
        post3.title = "Post #3";
        post3.text = "About post #3";
        post3.author = user2;
        post3.tags = [tag1];
        post3.counters = new Counters();
        post3.counters.likes = 1;
        post3.counters.likedUsers = [user2];
        await manager.save(post3);
    }

    it("where id", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            select: {
                id: true,
                tags: true
            },
            where: {
                id: 1,
                counters: {
                    likedUsers: {}
                }
            }
        }).build().getMany();
        posts.should.be.eql([{ id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } }]);
    })));

    it("where title", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            where: {
                title: "Post #2"
            }
        }).build().getMany();
        posts.should.be.eql([{ id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } }]);
    })));

    it("where two criteria", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            where: {
                title: "Post #2",
                text: "About post #2"
            }
        }).build().getMany();
        posts.should.be.eql([{ id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } }]);
    })));

    it("where two criteria without match", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            where: {
                title: "Post #2",
                text: "About post #3"
            }
        }).build().getMany();
        posts.should.be.eql([]);
    })));

    it("where relation", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts1 = await new FindOptionsBuilder(connection, Post, {
            where: {
                author: {
                    id: 1
                }
            }
        }).build().getMany();
        posts1.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
        ]);

        const posts2 = await new FindOptionsBuilder(connection, Post, {
            where: {
                author: {
                    id: 2
                }
            }
        }).build().getMany();
        posts2.should.be.eql([
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);
    })));

    it("where column and relation", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            where: {
                title: "Post #2",
                author: {
                    id: 1
                }
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
        ]);
    })));

    it("where nested relations", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            where: {
                author: {
                    photos: {
                        filename: "chain.jpg",
                        description: "Me and chain"
                    }
                }
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
        ]);
    })));

    it("where complex nested relations", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            where: {
                author: {
                    photos: {
                        filename: "chain.jpg",
                        description: "Me and chain"
                    }
                },
                tags: {
                    name: "category #1"
                }
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
        ]);
    })));

    it("where column in embed", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            where: {
                counters: {
                    likes: 1
                }
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);
    })));

    it("where relation in embed", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            where: {
                counters: {
                    likedUsers: {
                        firstName: "Gyro"
                    }
                }
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);
    })));

});
