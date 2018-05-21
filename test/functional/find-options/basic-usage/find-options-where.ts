import "reflect-metadata";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Post} from "./entity/Post";
import {prepareData} from "./find-options-test-utils";

describe("find options > where", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({ __dirname }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("where id", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await connection.createQueryBuilder(Post, "post").setFindOptions({
            where: {
                id: 1
            }
        }).getMany();
        posts.should.be.eql([{ id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } }]);
    })));

    it("where title", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await connection.createQueryBuilder(Post, "post").setFindOptions({
            where: {
                title: "Post #2"
            }
        }).getMany();
        posts.should.be.eql([{ id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } }]);
    })));

    it("where two criteria", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await connection.createQueryBuilder(Post, "post").setFindOptions({
            where: {
                title: "Post #2",
                text: "About post #2"
            }
        }).getMany();
        posts.should.be.eql([{ id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } }]);
    })));

    it("where two criteria without match", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await connection.createQueryBuilder(Post, "post").setFindOptions({
            where: {
                title: "Post #2",
                text: "About post #3"
            }
        }).getMany();
        posts.should.be.eql([]);
    })));

    it("where relation", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts1 = await connection.createQueryBuilder(Post, "post").setFindOptions({
            where: {
                author: {
                    id: 1
                }
            }
        }).getMany();
        posts1.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
        ]);

        const posts2 = await connection.createQueryBuilder(Post, "post").setFindOptions({
            where: {
                author: {
                    id: 2
                }
            }
        }).getMany();
        posts2.should.be.eql([
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);
    })));

    it("where column and relation", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await connection.createQueryBuilder(Post, "post").setFindOptions({
            where: {
                title: "Post #2",
                author: {
                    id: 1
                }
            }
        }).getMany();
        posts.should.be.eql([
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
        ]);
    })));

    it("where nested relations", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await connection.createQueryBuilder(Post, "post").setFindOptions({
            where: {
                author: {
                    photos: {
                        filename: "chain.jpg",
                        description: "Me and chain"
                    }
                }
            }
        }).getMany();
        posts.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
        ]);
    })));

    it("where complex nested relations", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await connection.createQueryBuilder(Post, "post").setFindOptions({
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
        }).getMany();
        posts.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
        ]);
    })));

    it("where column in embed", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await connection.createQueryBuilder(Post, "post").setFindOptions({
            where: {
                counters: {
                    likes: 1
                }
            }
        }).getMany();
        posts.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);
    })));

    it("where relation in embed", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await connection.createQueryBuilder(Post, "post").setFindOptions({
            where: {
                counters: {
                    likedUsers: {
                        firstName: "Gyro"
                    }
                }
            }
        }).getMany();
        posts.should.be.eql([
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);
    })));

});
