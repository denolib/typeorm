import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Foo} from "./entity/Foo.ts";
import {FooMetadata} from "./entity/FooMetadata.ts";
import {FooChildMetadata} from "./entity/FooChildMetadata.ts";

describe("github issues > #762 Nullable @Embedded inside @Embedded", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Foo, FooChildMetadata, FooMetadata],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work perfectly with all data set", () => Promise.all(connections.map(async connection => {

        const foo = new Foo();
        foo.name = "Apple";
        foo.metadata = new FooMetadata();
        foo.metadata.bar = 1;
        foo.metadata.child = new FooChildMetadata();
        foo.metadata.child.something = 2;
        foo.metadata.child.somethingElse = 3;
        await connection.manager.save(foo);

        const loadedFoo = await connection.getRepository(Foo).findOne({ name: "Apple" });
        loadedFoo!.should.be.eql({
            id: 1,
            name: "Apple",
            metadata: {
                bar: 1,
                child: {
                    something: 2,
                    somethingElse: 3
                }
            }
        });
    })));

    it("should work perfectly with some data not set", () => Promise.all(connections.map(async connection => {

        const foo = new Foo();
        foo.name = "Apple";
        foo.metadata = new FooMetadata();
        foo.metadata.bar = 1;
        foo.metadata.child = new FooChildMetadata();
        foo.metadata.child.somethingElse = 3;
        await connection.manager.save(foo);

        const loadedFoo = await connection.getRepository(Foo).findOne({ name: "Apple" });
        loadedFoo!.should.be.eql({
            id: 1,
            name: "Apple",
            metadata: {
                bar: 1,
                child: {
                    something: null,
                    somethingElse: 3
                }
            }
        });

        const foo2 = new Foo();
        foo2.name = "Apple2";
        foo2.metadata = new FooMetadata();
        foo2.metadata.child = new FooChildMetadata();
        foo2.metadata.child.something = 2;
        await connection.manager.save(foo2);

        const loadedFoo2 = await connection.getRepository(Foo).findOne({ name: "Apple2" });
        loadedFoo2!.should.be.eql({
            id: 2,
            name: "Apple2",
            metadata: {
                bar: null,
                child: {
                    something: 2,
                    somethingElse: null
                }
            }
        });

        const foo3 = new Foo();
        foo3.name = "Apple3";
        foo3.metadata = new FooMetadata();
        await connection.manager.save(foo3);

        const loadedFoo3 = await connection.getRepository(Foo).findOne({ name: "Apple3" });
        loadedFoo3!.should.be.eql({
            id: 3,
            name: "Apple3",
            metadata: {
                bar: null,
                child: {
                    something: null,
                    somethingElse: null
                }
            }
        });

    })));

    it("should work perfectly without any data set", () => Promise.all(connections.map(async connection => {
        const foo = new Foo();
        foo.name = "Orange";
        await connection.manager.save(foo);

        const loadedFoo = await connection.getRepository(Foo).findOne({ name: "Orange" });
        loadedFoo!.should.be.eql({
            id: 1,
            name: "Orange",
            metadata: {
                bar: null,
                child: {
                    something: null,
                    somethingElse: null
                }
            }
        });

    })));

});

runIfMain(import.meta);
