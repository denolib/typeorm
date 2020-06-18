import {Connection} from "../../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";
import {User} from "./entity/User.ts";
import "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import { expect } from "../../../deps/chai.ts";

describe("persistence > basic functionality", function() {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Category, Post, User],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should save an entity", () => Promise.all(connections.map(async connection => {
        await connection.manager.save(new Post(1, "Hello Post"));
    })));

    it("should remove an entity", () => Promise.all(connections.map(async connection => {
        const post = new Post(1, "Hello Post");
        await connection.manager.save(post);
        await connection.manager.remove(post);
    })));

    it("should throw an error when not an object is passed to a save method", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) Refactor following codes.
        try {
            await connection.manager.save(undefined);
            expect.fail('an error not to be thrown.');
        } catch (err) {
            expect(err.message).to.equal(`Cannot save, given value must be an entity, instead "undefined" is given.`);
        }

        try {
            await connection.manager.save(null);
            expect.fail('an error not to be thrown.');
        } catch (err) {
            expect(err.message).to.equal(`Cannot save, given value must be an entity, instead "null" is given.`);
        }

        try {
            await connection.manager.save(123);
            expect.fail('an error not to be thrown');
        } catch (err) {
            expect(err.message).to.equal(`Cannot save, given value must be an entity, instead "123" is given.`);
        }
    })));

    it("should throw an error when not an object is passed to a remove method", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) Refactor following codes.
        try {
            await connection.manager.remove(undefined);
            expect.fail('an error not to be thrown.');
        } catch (err) {
            expect(err.message).to.equal(`Cannot remove, given value must be an entity, instead "undefined" is given.`);
        }

        try {
            await connection.manager.remove(null);
            expect.fail('an error not to be thrown.');
        } catch (err) {
            expect(err.message).to.equal(`Cannot remove, given value must be an entity, instead "null" is given.`);
        }

        try {
            await connection.manager.remove(123);
            expect.fail('an error not to be thrown.');
        } catch (err) {
            expect(err.message).to.equal(`Cannot remove, given value must be an entity, instead "123" is given.`);
        }
    })));

    it("should throw an exception if object literal is given instead of constructed entity because it cannot determine what to save", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) Refactor following codes.
        try {
            await connection.manager.save({});
            expect.fail('an error not to be thrown.');
        } catch (err) {
            expect(err.message).to.equal(`Cannot save, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`);
        }

        try {
            await connection.manager.save([{}, {}]);
            expect.fail('an error not to be thrown.');
        } catch (err) {
            expect(err.message).to.equal(`Cannot save, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`);
        }

        try {
            await connection.manager.save([new Post(1, "Hello Post"), {}]);
            expect.fail('an error not to be thrown.');
        } catch (err) {
            expect(err.message).to.equal(`Cannot save, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`);
        }

        try {
            await connection.manager.remove({});
            expect.fail('an error not to be thrown.');
        } catch (err) {
            expect(err.message).to.equal(`Cannot remove, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`);
        }

        try {
            await connection.manager.remove([{}, {}]);
            expect.fail('an error not to be thrown.');
        } catch (err) {
            expect(err.message).to.equal(`Cannot remove, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`);
        }

        try {
            await connection.manager.remove([new Post(1, "Hello Post"), {}]);
        } catch (err) {
            expect(err.message).to.equal(`Cannot remove, given value must be instance of entity class, instead object literal is given. Or you must specify an entity target to method call.`)
        }
    })));

    it("should be able to save and remove entities of different types", () => Promise.all(connections.map(async connection => {
        const post = new Post(1, "Hello Post");
        const category = new Category(1, "Hello Category");
        const user = new User(1, "Hello User");

        await connection.manager.save([post, category, user]);
        expect(await connection.manager.findOne(Post, 1)).to.eql({ id: 1, title: "Hello Post" });
        expect(await connection.manager.findOne(Category, 1)).to.eql({ id: 1, name: "Hello Category" });
        expect(await connection.manager.findOne(User, 1)).to.eql({ id: 1, name: "Hello User" });

        await connection.manager.remove([post, category, user]);
        expect(await connection.manager.findOne(Post, 1)).to.be.undefined;
        expect(await connection.manager.findOne(Category, 1)).to.be.undefined;
        expect(await connection.manager.findOne(User, 1)).to.be.undefined;
    })));

});

runIfMain(import.meta);
