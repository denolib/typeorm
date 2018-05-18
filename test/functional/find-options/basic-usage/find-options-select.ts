import "reflect-metadata";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {FindOptionsBuilder} from "../../../../src/find-options/FindOptionsBuilder";
import {Post} from "./entity/Post";
import {prepareData} from "./find-options-test-utils";

describe.only("find options > select", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        __dirname,
        enabledDrivers: ["sqlite"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("select id", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts1 = await new FindOptionsBuilder(connection, Post, {
            select: ["id"],
            order: {
                id: "asc"
            }
        }).build().getMany();
        posts1.should.be.eql([
            { id: 1 },
            { id: 2 },
            { id: 3 },
        ]);

        const posts2 = await new FindOptionsBuilder(connection, Post, {
            select: {
                id: true
            },
            order: {
                id: "asc"
            }
        }).build().getMany();
        posts2.should.be.eql([
            { id: 1 },
            { id: 2 },
            { id: 3 },
        ]);
    })));

    it("select title", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts1 = await new FindOptionsBuilder(connection, Post, {
            select: ["title"],
            order: {
                title: "asc"
            }
        }).build().getMany();
        posts1.should.be.eql([
            { title: "Post #1" },
            { title: "Post #2" },
            { title: "Post #3" },
        ]);

        const posts2 = await new FindOptionsBuilder(connection, Post, {
            select: {
                title: true
            },
            order: {
                title: "asc"
            }
        }).build().getMany();
        posts2.should.be.eql([
            { title: "Post #1" },
            { title: "Post #2" },
            { title: "Post #3" },
        ]);
    })));

    it("select title and text", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts1 = await new FindOptionsBuilder(connection, Post, {
            select: ["title", "text"],
            order: {
                title: "asc"
            }
        }).build().getMany();
        posts1.should.be.eql([
            { title: "Post #1", text: "About post #1" },
            { title: "Post #2", text: "About post #2" },
            { title: "Post #3", text: "About post #3" },
        ]);

        const posts2 = await new FindOptionsBuilder(connection, Post, {
            select: {
                title: true,
                text: true
            },
            order: {
                title: "asc"
            }
        }).build().getMany();
        posts2.should.be.eql([
            { title: "Post #1", text: "About post #1" },
            { title: "Post #2", text: "About post #2" },
            { title: "Post #3", text: "About post #3" },
        ]);
    })));

    it("select column in embed", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const posts = await new FindOptionsBuilder(connection, Post, {
            select: {
                counters: {
                    likes: true
                }
            },
            order: {
                id: "asc"
            }
        }).build().getMany();
        posts.should.be.eql([
            { counters: { likes: 1 } },
            { counters: { likes: 2 } },
            { counters: { likes: 1 } },
        ]);
    })));

});
