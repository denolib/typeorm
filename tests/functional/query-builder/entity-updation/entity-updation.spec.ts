import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";

describe("query builder > entity updation", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({ __dirname }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should update entity model after insertion if updateEntity is set to true", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values(post)
            .updateEntity(true)
            .execute();

        expect(post.title).toEqual("about entity updation in query builder");
        expect(post.order).toEqual(100);
        expect(post.createDate).toBeInstanceOf(Date);
        expect(post.updateDate).toBeInstanceOf(Date);
    })));

    test("should not update entity model after insertion if updateEntity is set to false", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values(post)
            .updateEntity(false)
            .execute();

        expect(post.id).toBeUndefined();
        expect(post.title).toEqual("about entity updation in query builder");
        expect(post.order).toBeUndefined();
        expect(post.createDate).toBeUndefined();
        expect(post.updateDate).toBeUndefined();
    })));

    test("should not override already set properties", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";
        post.order = 101;

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values(post)
            .updateEntity(true)
            .execute();

        expect(post.title).toEqual("about entity updation in query builder");
        expect(post.order).toEqual(101);
        expect(post.createDate).toBeInstanceOf(Date);
        expect(post.updateDate).toBeInstanceOf(Date);
    })));

    test("should update entity model after save", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";
        await connection.manager.save(post);
        expect(post.version).toEqual(1);

        await connection.manager.save(post);
        expect(post.version).toEqual(1);

        post.title = "changed title";
        await connection.manager.save(post);
        expect(post.version).toEqual(2);
    })));

    test("should update special entity properties after entity updation if updateEntity is set to true", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";
        await connection.manager.save(post);
        expect(post.version).toEqual(1);

        await connection.createQueryBuilder()
            .update(Post)
            .set({ title: "again changed title" })
            .whereEntity(post)
            .updateEntity(true)
            .execute();

        expect(post.version).toEqual(2);
    })));

    test("should not update special entity properties after entity updation if updateEntity is set to true", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";
        await connection.manager.save(post);
        expect(post.version).toEqual(1);

        await connection.createQueryBuilder()
            .update(Post)
            .set({ title: "again changed title" })
            .whereEntity(post)
            .updateEntity(false)
            .execute();

        expect(post.version).toEqual(1);
    })));

});
