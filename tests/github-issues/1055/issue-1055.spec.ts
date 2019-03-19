import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Parent} from "./entity/Parent";
import {Child} from "./entity/Child";
import {PromiseUtils} from "../../../src";

describe("github issues > #1055 ind with relations not working, correct syntax causes type error", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"] // only one driver is enabled because this example uses lazy relations
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should be able to find by object reference", () => Promise.all(connections.map(async connection => {
        const manager = connection.manager;

        const parent = new Parent();
        parent.name = "Parent";
        await manager.save(parent);

        const loadedParent = await manager.findOne(Parent, 1);
        expect(loadedParent).not.toBeUndefined();

        if (!loadedParent) return;

        const child = connection.manager.create(Child, { // use alternative way of creating (to fix #1180 at the same time as well)
            name: "Child",
            parent: loadedParent
        });
        await manager.save(child);

        const foundChild = await manager.findOne(Child, { parent: loadedParent });
        expect(foundChild).not.toBeUndefined();
    })));


    test("should be able to lookup from promise as well", () => Promise.all(connections.map(async connection => {
        const manager = connection.manager;

        const parent = new Parent();
        parent.name = "Parent";
        await manager.save(parent);

        const loadedParent = await manager.findOne(Parent, 1);
        expect(loadedParent).not.toBeUndefined();

        if (!loadedParent) return;

        const child = new Child();
        child.name = "Child";
        child.parent = Promise.resolve(loadedParent);
        await manager.save(child);

        const foundChild = await manager.findOne(Child, { parent: PromiseUtils.create(loadedParent) });
        expect(foundChild).not.toBeUndefined();
    })));

    test("should not have type errors with the primary key type", () => Promise.all(connections.map(async connection => {
        const manager = connection.manager;

        const parent = new Parent();
        parent.name = "Parent";
        await manager.save(parent);

        const loadedParent = await manager.findOne(Parent, 1);
        expect(loadedParent).not.toBeUndefined();

        if (!loadedParent) return;

        const child = new Child();
        child.name = "Child";
        child.parent = Promise.resolve(loadedParent);
        await manager.save(child);

        const foundChild = await manager.findOne(Child, { parent: loadedParent.id });
        expect(foundChild).not.toBeUndefined();
    })));
});
