import "reflect-metadata";
import {Connection} from "../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases,
    sleep
} from "../../../utils/test-utils";
import {Post} from "./entity/Post";

describe.only("observers > working in transaction", function() {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql"]
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should observe entities when new entity is inserted", ok => {
        connections.filter((connection, index) => index === 0).map(async connection => {
            let globalEntities: Post[] = [], transactionEntities: Post[] = [];

            await connection.manager.save(new Post("Hello #1"));

            const globalSubscription = connection.manager
                .observe(Post)
                .subscribe(entities => {
                    console.log("entities", entities);
                    globalEntities = entities;
                });

            await sleep(50);
            globalEntities.should.be.eql([{ id: 1, title: "Hello #1", active: true }]);

            await connection.manager.transaction(async manager => {

                const transactionSubscription = manager
                    .observe(Post)
                    .subscribe(entities => {
                        transactionEntities = entities;
                    });

                await manager.save(new Post("Hello #2"));
                await sleep(50);
                globalEntities.should.be.eql([{ id: 1, title: "Hello #1", active: true }]);
                transactionEntities.should.be.eql([
                    { id: 1, title: "Hello #1", active: true },
                    { id: 2, title: "Hello #2", active: true },
                ]);

                await manager.save(new Post("Hello #3"));
                await sleep(50);
                globalEntities.should.be.eql([{ id: 1, title: "Hello #1", active: true }]);
                transactionEntities.should.be.eql([
                    { id: 1, title: "Hello #1", active: true },
                    { id: 2, title: "Hello #2", active: true },
                    { id: 3, title: "Hello #3", active: true },
                ]);

                transactionSubscription.unsubscribe();

                globalEntities.should.be.eql([{ id: 1, title: "Hello #1", active: true }]);
                transactionEntities.should.be.eql([
                    { id: 1, title: "Hello #1", active: true },
                    { id: 2, title: "Hello #2", active: true },
                    { id: 3, title: "Hello #3", active: true },
                ]);

            });
            await sleep(100);
            globalEntities.should.be.eql([
                { id: 1, title: "Hello #1", active: true },
                { id: 2, title: "Hello #2", active: true },
                { id: 3, title: "Hello #3", active: true },
            ]);

            globalSubscription.unsubscribe();
            await connection.manager.save(new Post("Hello #5"));
            await sleep(50);
            globalEntities.should.be.eql([
                { id: 1, title: "Hello #1", active: true },
                { id: 2, title: "Hello #2", active: true },
                { id: 3, title: "Hello #3", active: true },
            ]);

            ok();
        });
    });

});
