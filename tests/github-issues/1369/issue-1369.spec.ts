import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {ConcreteEntity} from "./entity/ConcreteEntity";

describe("github issues > #1369 EntitySubscriber not firing events on abstract class entity", () => {
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        subscribers: [__dirname + "/subscriber/*{.js,.ts}"],
        schemaCreate: true,
        dropSchema: true
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should fire the given event for an abstract entity", () => Promise.all(connections.map(async connection => {
        const entity = new ConcreteEntity();
        entity.firstname = "Michael";
        entity.lastname = "Scott";
        entity.position = "Regional Manager";
        await connection.manager.save(entity);

        const foundEntity = await connection.manager.findOne(ConcreteEntity, 1);
        expect(foundEntity).not.toBeUndefined();

        const assertObject = Object.assign({}, foundEntity);
        expect(assertObject)!.toEqual({
            id: 1,
            firstname: "Michael",
            lastname: "Scott",
            fullname: "Michael Scott",
            position: "Regional Manager" 
        });
    })));

});
