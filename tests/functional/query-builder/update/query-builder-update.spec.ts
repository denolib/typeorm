import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {User} from "./entity/User";
import {MysqlDriver} from "../../../../src/driver/mysql/MysqlDriver";
import {SqlServerDriver} from "../../../../src/driver/sqlserver/SqlServerDriver";
import {Photo} from "./entity/Photo";
import {EntityColumnNotFound} from "../../../../src/error/EntityColumnNotFound";
import {UpdateValuesMissingError} from "../../../../src/error/UpdateValuesMissingError";

describe("query builder > update", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should perform updation correctly", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Alex Messer";

        await connection.manager.save(user);

        await connection.createQueryBuilder()
            .update(User)
            .set({ name: "Dima Zotov" })
            .where("name = :name", { name: "Alex Messer" })
            .execute();

        const loadedUser1 = await connection.getRepository(User).findOne({ name: "Dima Zotov" });
        expect(loadedUser1).toBeDefined();
        expect(loadedUser1!.name).toEqual("Dima Zotov");

        await connection.getRepository(User)
            .createQueryBuilder("myUser")
            .update()
            .set({ name: "Muhammad Mirzoev" })
            .where("name = :name", { name: "Dima Zotov" })
            .execute();

        const loadedUser2 = await connection.getRepository(User).findOne({ name: "Muhammad Mirzoev" });
        expect(loadedUser2).toBeDefined();
        expect(loadedUser2!.name).toEqual("Muhammad Mirzoev");

    })));

    test("should be able to use sql functions", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Alex Messer";

        await connection.manager.save(user);

        await connection.createQueryBuilder()
            .update(User)
            .set({ name: () => connection.driver instanceof SqlServerDriver ? "SUBSTRING('Dima Zotov', 1, 4)" : "SUBSTR('Dima Zotov', 1, 4)" })
            .where("name = :name", {
                name: "Alex Messer"
            })
            .execute();


        const loadedUser1 = await connection.getRepository(User).findOne({ name: "Dima" });
        expect(loadedUser1).toBeDefined();
        expect(loadedUser1!.name).toEqual("Dima");

    })));

    test("should update and escape properly", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Dima";
        user.likesCount = 1;

        await connection.manager.save(user);

        const qb = connection.createQueryBuilder();
        await qb
            .update(User)
            .set({ likesCount: () => qb.escape(`likesCount`) + " + 1" })
            // .set({ likesCount: 2 })
            .where("likesCount = 1")
            .execute();

        const loadedUser1 = await connection.getRepository(User).findOne({ likesCount: 2 });
        expect(loadedUser1).toBeDefined();
        expect(loadedUser1!.name).toEqual("Dima");

    })));

    test("should update properties inside embeds as well", () => Promise.all(connections.map(async connection => {

        // save few photos
        await connection.manager.save(Photo, {
            url: "1.jpg",
            counters: {
                likes: 2,
                favorites: 1,
                comments: 1,
            }
        });
        await connection.manager.save(Photo, {
            url: "2.jpg",
            counters: {
                likes: 0,
                favorites: 1,
                comments: 1,
            }
        });

        // update photo now
        await connection.getRepository(Photo)
            .createQueryBuilder("photo")
            .update()
            .set({
                counters: {
                    likes: 3
                }
            })
            .where({
                counters: {
                    likes: 2
                }
            })
            .execute();

        const loadedPhoto1 = await connection.getRepository(Photo).findOne({ url: "1.jpg" });
        expect(loadedPhoto1).toBeDefined();
        expect(loadedPhoto1)!.toEqual({
            id: 1,
            url: "1.jpg",
            counters: {
                likes: 3,
                favorites: 1,
                comments: 1,
            }
        });

        const loadedPhoto2 = await connection.getRepository(Photo).findOne({ url: "2.jpg" });
        expect(loadedPhoto2).toBeDefined();
        expect(loadedPhoto2)!.toEqual({
            id: 2,
            url: "2.jpg",
            counters: {
                likes: 0,
                favorites: 1,
                comments: 1,
            }
        });

    })));

    test("should perform update with limit correctly", () => Promise.all(connections.map(async connection => {

        const user1 = new User();
        user1.name = "Alex Messer";
        const user2 = new User();
        user2.name = "Muhammad Mirzoev";
        const user3 = new User();
        user3.name = "Brad Porter";

        await connection.manager.save([user1, user2, user3]);

        const limitNum = 2;
        const nameToFind = "Dima Zotov";

        if (connection.driver instanceof MysqlDriver) {
            await connection.createQueryBuilder()
            .update(User)
            .set({ name: nameToFind })
            .limit(limitNum)
            .execute();

            const loadedUsers = await connection.getRepository(User).find({ name: nameToFind });
            expect(loadedUsers).toBeDefined();
            expect(loadedUsers!.length).toEqual(limitNum);
        } else {
            await expect(
                connection
                    .createQueryBuilder()
                    .update(User)
                    .set({ name: nameToFind })
                    .limit(limitNum)
                    .execute()
            ).rejects.toBeDefined();
        }
    })));

    test("should throw error when update value is missing", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Alex Messer";

        await connection.manager.save(user);

        let error: Error | undefined;
        try {
            await connection.createQueryBuilder()
                .update(User)
                .where("name = :name", { name: "Alex Messer" })
                .execute();
        } catch (err) {
            error = err;
        }
        expect(error).toBeInstanceOf(UpdateValuesMissingError);

    })));

    test("should throw error when update value is missing 2", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Alex Messer";

        await connection.manager.save(user);

        let error: Error | undefined;
        try {
            await connection.createQueryBuilder(User, "user")
                .update()
                .where("name = :name", { name: "Alex Messer" })
                .execute();
        } catch (err) {
            error = err;
        }
        expect(error).toBeInstanceOf(UpdateValuesMissingError);

    })));

    test("should throw error when update property in set method is unknown", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Alex Messer";

        await connection.manager.save(user);

        let error: Error | undefined;
        try {
            await connection.createQueryBuilder()
                .update(User)
                .set({ unknownProp: true } as any)
                .where("name = :name", { name: "Alex Messer" })
                .execute();
        } catch (err) {
            error = err;
        }
        expect(error).toBeInstanceOf(EntityColumnNotFound);

    })));

});
