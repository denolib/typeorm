import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {User} from "./model/User";
import {UserEntity} from "./schema/UserEntity";

describe("repository > find methods", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post, UserEntity],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    describe("count", function () {
        test("should return a full count when no criteria given", () => Promise.all(connections.map(async connection => {
            const postRepository            = connection.getRepository(Post);
            const promises: Promise<Post>[] = [];
            for (let i = 0; i < 100; i++) {
                const post        = new Post();
                post.id           = i;
                post.title        = "post #" + i;
                post.categoryName = "other";
                promises.push(postRepository.save(post));
            }

            const savedPosts = await Promise.all(promises);
            expect(savedPosts.length).toEqual(100); // check if they all are saved

            // check count method
            const count = await postRepository.count({ order: { id: "ASC" }});
            expect(count).toEqual(100);
        })));

        test("should return a count of posts that match given criteria", () => Promise.all(connections.map(async connection => {
            const postRepository = connection.getRepository(Post);
            const promises: Promise<Post>[] = [];
            for (let i = 1; i <= 100; i++) {
                const post        = new Post();
                post.id           = i;
                post.title        = "post #" + i;
                post.categoryName = i % 2 === 0 ? "even" : "odd";
                promises.push(postRepository.save(post));
            }

            const savedPosts = await Promise.all(promises);
            expect(savedPosts.length).toEqual(100); // check if they all are saved

            // check count method
            const count = await postRepository.count({
                where: { categoryName: "odd" },
                order: { id: "ASC" }
            });
            expect(count).toEqual(50);
        })));

        test("should return a count of posts that match given multiple criteria", () => Promise.all(connections.map(async connection => {
            const postRepository            = connection.getRepository(Post);
            const promises: Promise<Post>[] = [];
            for (let i = 1; i <= 100; i++) {
                const post        = new Post();
                post.id           = i;
                post.title        = "post #" + i;
                post.categoryName = i % 2 === 0 ? "even" : "odd";
                post.isNew        = i > 90;
                promises.push(postRepository.save(post));
            }

            const savedPosts = await Promise.all(promises);
            expect(savedPosts.length).toEqual(100); // check if they all are saved

            // check count method
            const count = await postRepository.count({
                where: { categoryName: "odd", isNew: true },
                order: { id: "ASC" }
            });
            expect(count).toEqual(5);
        })));

        test("should return a count of posts that match given find options", () => Promise.all(connections.map(async connection => {
            const postRepository            = connection.getRepository(Post);
            const promises: Promise<Post>[] = [];
            for (let i = 1; i <= 100; i++) {
                const post        = new Post();
                post.id           = i;
                post.isNew        = i > 90;
                post.title        = post.isNew ? "new post #" + i : "post #" + i;
                post.categoryName = i % 2 === 0 ? "even" : "odd";
                promises.push(postRepository.save(post));
            }

            const savedPosts = await Promise.all(promises);
            expect(savedPosts.length).toEqual(100); // check if they all are saved

            // check count method
            const count = await postRepository.count();
            expect(count).toEqual(100);
        })));

        test("should return a count of posts that match both criteria and find options", () => Promise.all(connections.map(async connection => {
            const postRepository            = connection.getRepository(Post);
            const promises: Promise<Post>[] = [];
            for (let i = 1; i <= 100; i++) {
                const post        = new Post();
                post.id           = i;
                post.isNew        = i > 90;
                post.title        = post.isNew ? "new post #" + i : "post #" + i;
                post.categoryName = i % 2 === 0 ? "even" : "odd";
                promises.push(postRepository.save(post));
            }

            const savedPosts = await Promise.all(promises);
            expect(savedPosts.length).toEqual(100); // check if they all are saved

            // check count method
            const count = await postRepository.count({
                where: { categoryName: "even", isNew: true },
                skip: 1,
                take:  2,
                order: { id: "ASC" }
            });
            expect(count).toEqual(5);
        })));
        
    });

    describe("find and findAndCount", function() {

        test("should return everything when no criteria given", () => Promise.all(connections.map(async connection => {
            const postRepository = connection.getRepository(Post);
            const promises: Promise<Post>[] = [];
            for (let i = 0; i < 100; i++) {
                const post = new Post();
                post.id = i;
                post.title = "post #" + i;
                post.categoryName = "other";
                promises.push(postRepository.save(post));
            }

            const savedPosts = await Promise.all(promises);
            expect(savedPosts.length).toEqual(100); // check if they all are saved

            // check find method
            const loadedPosts = await postRepository.find({ order: { id: "ASC" }});
            expect(loadedPosts).toBeInstanceOf(Array);
            expect(loadedPosts.length).toEqual(100);
            expect(loadedPosts[0].id).toEqual(0);
            expect(loadedPosts[0].title).toEqual("post #0");
            expect(loadedPosts[99].id).toEqual(99);
            expect(loadedPosts[99].title).toEqual("post #99");

            // check findAndCount method
            let [loadedPosts2, count] = await postRepository.findAndCount({ order: { id: "ASC" }});
            expect(count).toEqual(100);
            expect(loadedPosts2).toBeInstanceOf(Array);
            expect(loadedPosts2.length).toEqual(100);
            expect(loadedPosts2[0].id).toEqual(0);
            expect(loadedPosts2[0].title).toEqual("post #0");
            expect(loadedPosts2[99].id).toEqual(99);
            expect(loadedPosts2[99].title).toEqual("post #99");
        })));

        test("should return posts that match given criteria", () => Promise.all(connections.map(async connection => {
            const postRepository = connection.getRepository(Post);
            const promises: Promise<Post>[] = [];
            for (let i = 1; i <= 100; i++) {
                const post = new Post();
                post.id = i;
                post.title = "post #" + i;
                post.categoryName = i % 2 === 0 ? "even" : "odd";
                promises.push(postRepository.save(post));
            }

            const savedPosts = await Promise.all(promises);
            expect(savedPosts.length).toEqual(100); // check if they all are saved

            // check find method
            const loadedPosts = await postRepository.find({
                where: { categoryName: "odd" },
                order: { id: "ASC" }
            });
            expect(loadedPosts).toBeInstanceOf(Array);
            expect(loadedPosts.length).toEqual(50);
            expect(loadedPosts[0].id).toEqual(1);
            expect(loadedPosts[0].title).toEqual("post #1");
            expect(loadedPosts[49].id).toEqual(99);
            expect(loadedPosts[49].title).toEqual("post #99");

            // check findAndCount method
            let [loadedPosts2, count] = await postRepository.findAndCount({
                where: { categoryName: "odd" },
                order: { id: "ASC" }
            });
            expect(count).toEqual(50);
            expect(loadedPosts2).toBeInstanceOf(Array);
            expect(loadedPosts2.length).toEqual(50);
            expect(loadedPosts2[0].id).toEqual(1);
            expect(loadedPosts2[0].title).toEqual("post #1");
            expect(loadedPosts2[49].id).toEqual(99);
            expect(loadedPosts2[49].title).toEqual("post #99");
        })));

        test("should return posts that match given multiple criteria", () => Promise.all(connections.map(async connection => {
            const postRepository = connection.getRepository(Post);
            const promises: Promise<Post>[] = [];
            for (let i = 1; i <= 100; i++) {
                const post = new Post();
                post.id = i;
                post.title = "post #" + i;
                post.categoryName = i % 2 === 0 ? "even" : "odd";
                post.isNew = i > 90;
                promises.push(postRepository.save(post));
            }

            const savedPosts = await Promise.all(promises);
            expect(savedPosts.length).toEqual(100); // check if they all are saved

            // check find method
            const loadedPosts = await postRepository.find({
                where: { categoryName: "odd", isNew: true },
                order: { id: "ASC" }
            });
            expect(loadedPosts).toBeInstanceOf(Array);
            expect(loadedPosts.length).toEqual(5);
            expect(loadedPosts[0].id).toEqual(91);
            expect(loadedPosts[0].title).toEqual("post #91");
            expect(loadedPosts[4].id).toEqual(99);
            expect(loadedPosts[4].title).toEqual("post #99");

            // check findAndCount method
            let [loadedPosts2, count] = await postRepository.findAndCount({
                where: { categoryName: "odd", isNew: true },
                order: { id: "ASC" }
            });
            expect(count).toEqual(5);
            expect(loadedPosts2).toBeInstanceOf(Array);
            expect(loadedPosts2.length).toEqual(5);
            expect(loadedPosts2[0].id).toEqual(91);
            expect(loadedPosts2[0].title).toEqual("post #91");
            expect(loadedPosts2[4].id).toEqual(99);
            expect(loadedPosts2[4].title).toEqual("post #99");
        })));

        test("should return posts that match given find options", () => Promise.all(connections.map(async connection => {
            const postRepository = connection.getRepository(Post);
            const promises: Promise<Post>[] = [];
            for (let i = 1; i <= 100; i++) {
                const post = new Post();
                post.id = i;
                post.isNew = i > 90;
                post.title = post.isNew ? "new post #" + i : "post #" + i;
                post.categoryName = i % 2 === 0 ? "even" : "odd";
                promises.push(postRepository.save(post));
            }

            const savedPosts = await Promise.all(promises);
            expect(savedPosts.length).toEqual(100); // check if they all are saved

            // check find method
            const loadedPosts = await postRepository.createQueryBuilder("post")
                .where("post.title LIKE :likeTitle AND post.categoryName = :categoryName")
                .setParameters({
                    likeTitle: "new post #%",
                    categoryName: "even"
                })
                .orderBy("post.id", "ASC")
                .getMany();
            expect(loadedPosts).toBeInstanceOf(Array);
            expect(loadedPosts.length).toEqual(5);
            expect(loadedPosts[0].id).toEqual(92);
            expect(loadedPosts[0].title).toEqual("new post #92");
            expect(loadedPosts[4].id).toEqual(100);
            expect(loadedPosts[4].title).toEqual("new post #100");

            // check findAndCount method
            const [loadedPosts2, count] = await postRepository.createQueryBuilder("post")
                .where("post.title LIKE :likeTitle AND post.categoryName = :categoryName")
                .setParameters({
                    likeTitle: "new post #%",
                    categoryName: "even"
                })
                .orderBy("post.id", "ASC")
                .getManyAndCount();
            expect(count).toEqual(5);
            expect(loadedPosts2).toBeInstanceOf(Array);
            expect(loadedPosts2.length).toEqual(5);
            expect(loadedPosts2[0].id).toEqual(92);
            expect(loadedPosts2[0].title).toEqual("new post #92");
            expect(loadedPosts2[4].id).toEqual(100);
            expect(loadedPosts2[4].title).toEqual("new post #100");
        })));

        test("should return posts that match both criteria and find options", () => Promise.all(connections.map(async connection => {
            const postRepository = connection.getRepository(Post);
            const promises: Promise<Post>[] = [];
            for (let i = 1; i <= 100; i++) {
                const post = new Post();
                post.id = i;
                post.isNew = i > 90;
                post.title = post.isNew ? "new post #" + i : "post #" + i;
                post.categoryName = i % 2 === 0 ? "even" : "odd";
                promises.push(postRepository.save(post));
            }

            const savedPosts = await Promise.all(promises);
            expect(savedPosts.length).toEqual(100); // check if they all are saved

            // check find method
            const loadedPosts = await postRepository.find({
                where: {
                    categoryName: "even",
                    isNew: true
                },
                skip: 1,
                take: 2,
                order: {
                    id: "ASC"
                }
            });
            expect(loadedPosts).toBeInstanceOf(Array);
            expect(loadedPosts.length).toEqual(2);
            expect(loadedPosts[0].id).toEqual(94);
            expect(loadedPosts[0].title).toEqual("new post #94");
            expect(loadedPosts[1].id).toEqual(96);
            expect(loadedPosts[1].title).toEqual("new post #96");

            // check findAndCount method
            let [loadedPosts2, count] = await postRepository.findAndCount({
                where: {
                    categoryName: "even",
                    isNew: true
                },
                skip: 1,
                take: 2,
                order: {
                    id: "ASC"
                }
            });
            expect(count).toEqual(5);
            expect(loadedPosts2).toBeInstanceOf(Array);
            expect(loadedPosts2.length).toEqual(2);
            expect(loadedPosts2[0].id).toEqual(94);
            expect(loadedPosts2[0].title).toEqual("new post #94");
            expect(loadedPosts2[1].id).toEqual(96);
            expect(loadedPosts2[1].title).toEqual("new post #96");
        })));

    });

    describe("findOne", function() {

        test("should return first when no criteria given", () => Promise.all(connections.map(async connection => {
            const userRepository = connection.getRepository<User>("User");
            const promises: Promise<User>[] = [];
            for (let i = 0; i < 100; i++) {
                const user: User = {
                    id: i,
                    firstName: "name #" + i,
                    secondName: "Doe"
                };
                promises.push(userRepository.save(user));
            }

            const savedUsers = await Promise.all(promises);
            expect(savedUsers.length).toEqual(100); // check if they all are saved

            const loadedUser = (await userRepository.findOne({ order: { id: "ASC" }}))!;
            expect(loadedUser.id).toEqual(0);
            expect(loadedUser.firstName).toEqual("name #0");
            expect(loadedUser.secondName).toEqual("Doe");
        })));

        test("should return when criteria given", () => Promise.all(connections.map(async connection => {
            const userRepository = connection.getRepository<User>("User");
            const promises: Promise<User>[] = [];
            for (let i = 0; i < 100; i++) {
                const user: User = {
                    id: i,
                    firstName: "name #" + i,
                    secondName: "Doe"
                };
                promises.push(userRepository.save(user));
            }

            const savedUsers = await Promise.all(promises);
            expect(savedUsers.length).toEqual(100); // check if they all are saved

            const loadedUser = (await userRepository.findOne({ where: { firstName: "name #1" }, order: { id: "ASC" } }))!;
            expect(loadedUser.id).toEqual(1);
            expect(loadedUser.firstName).toEqual("name #1");
            expect(loadedUser.secondName).toEqual("Doe");
        })));

        test("should return when find options given", () => Promise.all(connections.map(async connection => {
            const userRepository = connection.getRepository<User>("User");
            const promises: Promise<User>[] = [];
            for (let i = 0; i < 100; i++) {
                const user: User = {
                    id: i,
                    firstName: "name #" + i,
                    secondName: "Doe"
                };
                promises.push(userRepository.save(user));
            }

            const savedUsers = await Promise.all(promises);
            expect(savedUsers.length).toEqual(100); // check if they all are saved

            const loadedUser = await userRepository.findOne({
                where: {
                    firstName: "name #99",
                    secondName: "Doe"
                },
                order: {
                    id: "ASC"
                }
            });
            expect(loadedUser!.id).toEqual(99);
            expect(loadedUser!.firstName).toEqual("name #99");
            expect(loadedUser!.secondName).toEqual("Doe");
        })));

    });

    describe("findOne", function() {

        test("should return entity by a given id", () => Promise.all(connections.map(async connection => {
            const userRepository = connection.getRepository<User>("User");
            const promises: Promise<User>[] = [];
            for (let i = 0; i < 100; i++) {
                const user: User = {
                    id: i,
                    firstName: "name #" + i,
                    secondName: "Doe"
                };
                promises.push(userRepository.save(user));
            }

            const savedUsers = await Promise.all(promises);
            expect(savedUsers.length).toEqual(100); // check if they all are saved

            let loadedUser = (await userRepository.findOne(0))!;
            expect(loadedUser.id).toEqual(0);
            expect(loadedUser.firstName).toEqual("name #0");
            expect(loadedUser.secondName).toEqual("Doe");

            loadedUser = (await userRepository.findOne(1))!;
            expect(loadedUser.id).toEqual(1);
            expect(loadedUser.firstName).toEqual("name #1");
            expect(loadedUser.secondName).toEqual("Doe");

            loadedUser = (await userRepository.findOne(99))!;
            expect(loadedUser.id).toEqual(99);
            expect(loadedUser.firstName).toEqual("name #99");
            expect(loadedUser.secondName).toEqual("Doe");
        })));

        test("should return entity by a given id and find options", () => Promise.all(connections.map(async connection => {
            const userRepository = connection.getRepository<User>("User");
            const promises: Promise<User>[] = [];
            for (let i = 0; i < 100; i++) {
                const user: User = {
                    id: i,
                    firstName: "name #" + i,
                    secondName: "Doe"
                };
                promises.push(userRepository.save(user));
            }

            const savedUsers = await Promise.all(promises);
            expect(savedUsers.length).toEqual(100); // check if they all are saved

            let loadedUser = await userRepository.findOne(0, {
                where: {
                    secondName: "Doe"
                }
            });
            expect(loadedUser!.id).toEqual(0);
            expect(loadedUser!.firstName).toEqual("name #0");
            expect(loadedUser!.secondName).toEqual("Doe");

            loadedUser = await userRepository.findOne(1, {
                where: {
                    secondName: "Dorian"
                }
            });
            expect(loadedUser).toBeUndefined();
        })));

    });

    describe("findByIds", function() {

        test("should return entities by given ids", () => Promise.all(connections.map(async connection => {
            const userRepository = connection.getRepository<User>("User");

            const users = [1, 2, 3, 4, 5].map(id => {
                return {
                    id,
                    firstName: `name #${id}`,
                    secondName: "Doe"
                };
            });

            const savedUsers = await userRepository.save(users);
            expect(savedUsers.length).toEqual(users.length); // check if they all are saved

            const loadIds = [1, 2, 4];
            const loadedUsers = (await userRepository.findByIds(loadIds))!;

            expect(loadedUsers.map(user => user.id)).toEqual(loadIds);
        })));

    });

    describe("findOneOrFail", function() {

        test("should return entity by a given id", () => Promise.all(connections.map(async connection => {
            const userRepository = connection.getRepository<User>("User");
            const promises: Promise<User>[] = [];
            for (let i = 0; i < 100; i++) {
                const user: User = {
                    id: i,
                    firstName: "name #" + i,
                    secondName: "Doe"
                };
                promises.push(userRepository.save(user));
            }

            const savedUsers = await Promise.all(promises);
            expect(savedUsers.length).toEqual(100); // check if they all are saved

            let loadedUser = (await userRepository.findOneOrFail(0))!;
            expect(loadedUser.id).toEqual(0);
            expect(loadedUser.firstName).toEqual("name #0");
            expect(loadedUser.secondName).toEqual("Doe");

            loadedUser = (await userRepository.findOneOrFail(1))!;
            expect(loadedUser.id).toEqual(1);
            expect(loadedUser.firstName).toEqual("name #1");
            expect(loadedUser.secondName).toEqual("Doe");

            loadedUser = (await userRepository.findOneOrFail(99))!;
            expect(loadedUser.id).toEqual(99);
            expect(loadedUser.firstName).toEqual("name #99");
            expect(loadedUser.secondName).toEqual("Doe");
        })));

        test("should return entity by a given id and find options", () => Promise.all(connections.map(async connection => {
            const userRepository = connection.getRepository<User>("User");
            const promises: Promise<User>[] = [];
            for (let i = 0; i < 100; i++) {
                const user: User = {
                    id: i,
                    firstName: "name #" + i,
                    secondName: "Doe"
                };
                promises.push(userRepository.save(user));
            }

            const savedUsers = await Promise.all(promises);
            expect(savedUsers.length).toEqual(100); // check if they all are saved

            let loadedUser = await userRepository.findOneOrFail(0, {
                where: {
                    secondName: "Doe"
                }
            });
            expect(loadedUser!.id).toEqual(0);
            expect(loadedUser!.firstName).toEqual("name #0");
            expect(loadedUser!.secondName).toEqual("Doe");

            await expect(
                userRepository
                    .findOneOrFail(1, {
                        where: {
                            secondName: "Dorian"
                        }
                    })).rejects.toBeDefined();
        })));

        test("should throw an error if nothing was found", () => Promise.all(connections.map(async connection => {
            const userRepository = connection.getRepository<User>("User");
            const promises: Promise<User>[] = [];
            for (let i = 0; i < 100; i++) {
                const user: User = {
                    id: i,
                    firstName: "name #" + i,
                    secondName: "Doe"
                };
                promises.push(userRepository.save(user));
            }

            const savedUsers = await Promise.all(promises);
            expect(savedUsers.length).toEqual(100); // check if they all are saved

            await expect(
                userRepository
                    .findOneOrFail(100)
            ).rejects.toBeDefined();
        })));
    });

});
