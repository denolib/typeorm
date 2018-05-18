import "reflect-metadata";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {FindOptionsBuilder} from "../../../../src/find-options/FindOptionsBuilder";
import {Post} from "./entity/Post";
import {prepareData} from "./find-options-test-utils";

describe("find options > order", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        __dirname,
        enabledDrivers: ["sqlite"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("order by id DESC", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts1 = await new FindOptionsBuilder(connection, Post, {
            order: {
                id: "ASC"
            }
        }).build().getMany();
        posts1.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);

        const posts2 = await new FindOptionsBuilder(connection, Post, {
            order: {
                id: "asc"
            }
        }).build().getMany();
        posts2.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);

        const posts3 = await new FindOptionsBuilder(connection, Post, {
            order: {
                id: 1
            }
        }).build().getMany();
        posts3.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);

        const posts4 = await new FindOptionsBuilder(connection, Post, {
            order: {
                id: {
                    direction: "asc"
                }
            }
        }).build().getMany();
        posts4.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);

        const posts5 = await new FindOptionsBuilder(connection, Post, {
            order: {
                id: "DESC"
            }
        }).build().getMany();
        posts5.should.be.eql([
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
        ]);

        const posts6 = await new FindOptionsBuilder(connection, Post, {
            order: {
                id: "desc"
            }
        }).build().getMany();
        posts6.should.be.eql([
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
        ]);

        const posts7 = await new FindOptionsBuilder(connection, Post, {
            order: {
                id: -1
            }
        }).build().getMany();
        posts7.should.be.eql([
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
        ]);

        const posts8 = await new FindOptionsBuilder(connection, Post, {
            order: {
                id: {
                    direction: "DESC"
                }
            }
        }).build().getMany();
        posts8.should.be.eql([
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
        ]);
    })));

    it("order by title", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            order: {
                title: "desc"
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
        ]);
    })));

    it("where two criteria", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            order: {
                title: "desc",
                text: "asc"
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
        ]);
    })));

    it("order by relation", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            order: {
                author: {
                    id: "desc"
                }
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
        ]);
    })));

    it("order by relation with where relation applied", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            where: {
                author: {
                    id: 1
                }
            },
            order: {
                author: {
                    id: "desc"
                }
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
        ]);
    })));

    it("order by nested relations", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            order: {
                author: {
                    photos: {
                        filename: "asc",
                    }
                }
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
        ]);
    })));

    it("order by complex nested relations", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            order: {
                author: {
                    photos: {
                        filename: "desc"
                    }
                },
                tags: {
                    name: "asc"
                }
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);
    })));

    it("order by column in embed", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            order: {
                counters: {
                    likes: "desc"
                }
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        ]);
    })));

    it("order by relation in embed", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            order: {
                counters: {
                    likedUsers: {
                        firstName: "asc"
                    }
                }
            }
        }).build().getMany();
        posts.should.be.eql([
            { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
            { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
            { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
        ]);
    })));

});
