import "reflect-metadata";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {FindOptionsBuilder} from "../../../../src/find-options/FindOptionsBuilder";
import {Post} from "./entity/Post";
import {prepareData} from "./find-options-test-utils";

describe.only("find options > relations", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        __dirname,
        enabledDrivers: ["sqlite"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it.only("basic relation", () => Promise.all(connections.map(async connection => {
        await prepareData(connection.manager);

        const builder = new FindOptionsBuilder(connection, Post, {
            select: {
                author: {
                    id: true,
                    age: true
                },
                tags: {
                    id: true
                }
            },
            relations: {
                author: {
                    photos: true
                }
            },
            // where: {
            //     author: {
            //         id: In([1, 2])
            //     }
            // },
            order: {
                author: {
                    age: "desc"
                }
            }
        });
        const posts1 = await builder.getMany();
        console.log(posts1[0]);
        console.log(posts1[1]);
        console.log(posts1[2]);

        // await Promise.all(builder.relationFindOptionBuilders.map(async subBuilder => {
        //     const result = await subBuilder.build().getMany();
        //     console.log(result);
        // }));
        //
        // const posts1 = await qb.getMany();
        // posts1.should.be.eql([
        //     { id: 1, title: "Post #1", text: "About post #1", counters: { likes: 1 } },
        //     { id: 2, title: "Post #2", text: "About post #2", counters: { likes: 2 } },
        // ]);

        // const posts2 = await new FindOptionsBuilder(connection, Post, {
        //     relations: {
        //         author: true
        //     }
        // }).build().getMany();

        // posts2.should.be.eql([
        //     { id: 3, title: "Post #3", text: "About post #3", counters: { likes: 1 } },
        // ]);
    })));

});
