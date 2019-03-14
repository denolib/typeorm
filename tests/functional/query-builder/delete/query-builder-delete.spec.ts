import "reflect-metadata";
import {Connection} from "../../../../src";
import {User} from "./entity/User";
import {Photo} from "./entity/Photo";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../test/utils/test-utils";

describe("query builder > delete", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should perform deletion correctly", () => Promise.all(connections.map(async connection => {

        const user1 = new User();
        user1.name = "Alex Messer";
        await connection.manager.save(user1);

        await connection.createQueryBuilder()
            .delete()
            .from(User)
            .where("name = :name", { name: "Alex Messer" })
            .execute();

        const loadedUser1 = await connection.getRepository(User).findOne({ name: "Dima Zotov" });
        expect(loadedUser1).toBeUndefined();

        const user2 = new User();
        user2.name = "Alex Messer";
        await connection.manager.save(user2);

        await connection.getRepository(User)
            .createQueryBuilder("myUser")
            .delete()
            .where("name = :name", { name: "Dima Zotov" })
            .execute();

        const loadedUser2 = await connection.getRepository(User).findOne({ name: "Dima Zotov" });
        expect(loadedUser2).toBeUndefined();

    })));

    test("should be able to delete entities by embed criteria", () => Promise.all(connections.map(async connection => {

        // save few photos
        await connection.manager.save(Photo, { url: "1.jpg" });
        await connection.manager.save(Photo, {
            url: "2.jpg",
            counters: {
                likes: 2,
                favorites: 1,
                comments: 1,
            }
        });
        await connection.manager.save(Photo, { url: "3.jpg" });

        // make sure photo with likes = 2 exist
        const loadedPhoto1 = await connection.getRepository(Photo).findOne({ counters: { likes: 2 } });
        expect(loadedPhoto1).toBeDefined();
        expect(loadedPhoto1)!.toEqual({
            id: 2,
            url: "2.jpg",
            counters: {
                likes: 2,
                favorites: 1,
                comments: 1,
            }
        });

        // delete photo now
        await connection.getRepository(Photo)
            .createQueryBuilder("photo")
            .delete()
            .where({
                counters: {
                    likes: 2
                }
            })
            .execute();

        const loadedPhoto2 = await connection.getRepository(Photo).findOne({ url: "1.jpg" });
        expect(loadedPhoto2).toBeDefined();

        const loadedPhoto3 = await connection.getRepository(Photo).findOne({ url: "2.jpg" });
        expect(loadedPhoto3).toBeUndefined();

        const loadedPhoto4 = await connection.getRepository(Photo).findOne({ url: "3.jpg" });
        expect(loadedPhoto4).toBeDefined();
    })));

    test("should return correct delete result", () => Promise.all(connections.map(async connection => {

        // don't run test for sqlite and sqljs as they don't return affected rows
        if (connection.name === "sqlite" || connection.name === "sqljs")
            return;

        // save some users
        const user1 = new User();
        user1.name = "John Doe";
        const user2 = new User();
        user2.name = "Jane Doe";
        await connection.manager.save([user1, user2]);

        const result = await connection.createQueryBuilder()
            .delete()
            .from(User)
            .execute();

        expect(result.affected).toEqual(2);
    })));

});
