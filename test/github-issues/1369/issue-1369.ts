import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {ConcreteEntity} from "./entity/ConcreteEntity.ts";
import {AbstractEntity} from "./entity/AbstractEntity.ts";
import {AbstractEntitySubscriber} from "./subscriber/AbstractEntitySubscriber.ts";

describe("github issues > #1369 EntitySubscriber not firing events on abstract class entity", () => {
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [AbstractEntity, ConcreteEntity],
        subscribers: [AbstractEntitySubscriber],
        schemaCreate: true,
        dropSchema: true
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should fire the given event for an abstract entity", () => Promise.all(connections.map(async connection => {
        const entity = new ConcreteEntity();
        entity.firstname = "Michael";
        entity.lastname = "Scott";
        entity.position = "Regional Manager";
        await connection.manager.save(entity);

        const foundEntity = await connection.manager.findOne(ConcreteEntity, 1);
        expect(foundEntity).to.not.be.undefined;

        const assertObject = Object.assign({}, foundEntity);
        assertObject!.should.be.eql({
            id: 1,
            firstname: "Michael",
            lastname: "Scott",
            fullname: "Michael Scott",
            position: "Regional Manager"
        });
    })));

});

runIfMain(import.meta);
