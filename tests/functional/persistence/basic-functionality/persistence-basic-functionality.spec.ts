import "reflect-metadata";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {User} from "./entity/User";

describe("persistence > basic functionality", function() {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should save an entity", () => Promise.all(connections.map(async connection => {
        await connection.manager.save(new Post(1, "Hello Post"));
    })));

    test("should remove an entity", () => Promise.all(connections.map(async connection => {
        const post = new Post(1, "Hello Post");
        await connection.manager.save(post);
        await connection.manager.remove(post);
    })));

    test("should throw an error when not an object is passed to a save method", () => Promise.all(connections.map(async connection => {
        await expect(connection.manager.save(undefined)).rejects.toThrow(`Cannot save, given value must be an entity, instead "undefined" is given.`);
        await expect(connection.manager.save(null)).rejects.toThrow(`Cannot save, given value must be an entity, instead "null" is given.`);
        await expect(connection.manager.save(123)).rejects.toThrow(`Cannot save, given value must be an entity, instead "123" is given.`);
    })));

    test("should throw an error when not an object is passed to a remove method", () => Promise.all(connections.map(async connection => {
        await expect(connection.manager.remove(undefined)).rejects.toThrow(`Cannot remove, given value must be an entity, instead "undefined" is given.`);
        await expect(connection.manager.remove(null)).rejects.toThrow(`Cannot remove, given value must be an entity, instead "null" is given.`);
        await expect(connection.manager.remove(123)).rejects.toThrow(`Cannot remove, given value must be an entity, instead "123" is given.`);
    })));

    test("should throw an exception if object literal is given instead of constructed entity because it cannot determine what to save", () => Promise.all(connections.map(async connection => {
        await expect(connection.manager.save({})).rejects.toThrow(`Cannot save, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`);
        await expect(connection.manager.save([{}, {}])).rejects.toThrow(`Cannot save, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`);
        await expect(connection.manager.save([new Post(1, "Hello Post"), {}])).rejects.toThrow(`Cannot save, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`);
        await expect(connection.manager.remove({})).rejects.toThrow(`Cannot remove, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`);
        await expect(connection.manager.remove([{}, {}])).rejects.toThrow(`Cannot remove, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`);
        await expect(connection.manager.remove([new Post(1, "Hello Post"), {}])).rejects.toThrow(`Cannot remove, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`);
    })));

    test("should be able to save and remove entities of different types", () => Promise.all(connections.map(async connection => {
        const post = new Post(1, "Hello Post");
        const category = new Category(1, "Hello Category");
        const user = new User(1, "Hello User");

        await connection.manager.save([post, category, user]);
        await expect(connection.manager.findOne(Post, 1)).resolves.toEqual({ id: 1, title: "Hello Post" });
        await expect(connection.manager.findOne(Category, 1)).resolves.toEqual({ id: 1, name: "Hello Category" });
        await expect(connection.manager.findOne(User, 1)).resolves.toEqual({ id: 1, name: "Hello User" });

        await connection.manager.remove([post, category, user]);
        await expect(connection.manager.findOne(Post, 1)).resolves.toBeUndefined();
        await expect(connection.manager.findOne(Category, 1)).resolves.toBeUndefined();
        await expect(connection.manager.findOne(User, 1)).resolves.toBeUndefined();
    })));

});
