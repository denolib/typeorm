import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases, sleep} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";
import {Category} from "./entity/Category.ts";
import {Post} from "./entity/Post.ts";
import {Photo} from "./entity/Photo.ts";

describe("repository > find options", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Photo, Post, User],
        enabledDrivers: ["sqlite"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should load relations", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Alex Messer";
        await connection.manager.save(user);

        const category = new Category();
        category.name = "Boys";
        await connection.manager.save(category);

        const post = new Post();
        post.title = "About Alex Messer";
        post.author = user;
        post.categories = [category];
        await connection.manager.save(post);

        const loadedPost = await connection.getRepository(Post).findOne({
            relations: ["author", "categories"]
        });
        expect(loadedPost).to.be.eql({
            id: 1,
            title: "About Alex Messer",
            author: {
                id: 1,
                name: "Alex Messer"
            },
            categories: [{
                id: 1,
                name: "Boys"
            }]
        });

    })));

    it("should select specific columns", () => Promise.all(connections.map(async connection => {

        const category = new Category();
        category.name = "Bears";
        await connection.manager.save(category);

        const categories = [category];
        const photos = [];
        for (let i = 1; i < 10; i++) {
            const photo = new Photo();
            photo.name = `Me and Bears ${i}`;
            photo.description = `I am near bears ${i}`;
            photo.filename = `photo-with-bears-${i}.jpg`;
            photo.views = 10;
            photo.isPublished = false;
            photo.categories = categories;
            photos.push(photo);
            await connection.manager.save(photo);
        }

        const loadedPhoto = await connection.getRepository(Photo).findOne({
            select: ["name"],
            where: {
                id: 5
            }
        });

        const loadedPhotos1 = await connection.getRepository(Photo).find({
            select: ["filename", "views"],
        });

        const loadedPhotos2 = await connection.getRepository(Photo).find({
            select: ["id", "name", "description"],
            relations: ["categories"],
        });

        // const loadedPhotos3 = await connection.getRepository(Photo).createQueryBuilder("photo")
        //     .select(["photo.name", "photo.description"])
        //     .addSelect(["category.name"])
        //     .leftJoin("photo.categories", "category")
        //     .getMany();

        expect(loadedPhoto).to.be.eql({
            name: "Me and Bears 5"
        });

        expect(loadedPhotos1).to.have.deep.members(photos.map(photo => ({
            filename: photo.filename,
            views: photo.views,
        })));

        expect(loadedPhotos2).to.have.deep.members(photos.map(photo => ({
            id: photo.id,
            name: photo.name,
            description: photo.description,
            categories,
        })));

        // expect(loadedPhotos3).to.have.deep.members(photos.map(photo => ({
        //     name: photo.name,
        //     description: photo.description,
        //     categories: categories.map(category => ({
        //         name: category.name,
        //     })),
        // })));
    })));

    it("should select by given conditions", () => Promise.all(connections.map(async connection => {

        const category1 = new Category();
        category1.name = "Bears";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.name = "Dogs";
        await connection.manager.save(category2);

        const category3 = new Category();
        category3.name = "Cats";
        await connection.manager.save(category3);

        const loadedCategories1 = await connection.getRepository(Category).find({
            where: {
                name: "Bears"
            }
        });

        expect(loadedCategories1).to.be.eql([{
            id: 1,
            name: "Bears"
        }]);

        const loadedCategories2 = await connection.getRepository(Category).find({
            where: [{
                name: "Bears"
            }, {
                name: "Cats"
            }]
        });

        expect(loadedCategories2).to.be.eql([{
            id: 1,
            name: "Bears"
        }, {
            id: 3,
            name: "Cats"
        }]);

    })));

});


describe("repository > find options > cache", () => {
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Photo, Post, User],
        cache: true
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("repository should cache results properly", () => Promise.all(connections.map(async connection => {

        // first prepare data - insert users
        const user1 = new User();
        user1.name = "Harry";
        await connection.manager.save(user1);

        const user2 = new User();
        user2.name = "Ron";
        await connection.manager.save(user2);

        const user3 = new User();
        user3.name = "Hermione";
        await connection.manager.save(user3);

        // select for the first time with caching enabled
        const users1 = await connection.getRepository(User)
            .find({cache: true});

        expect(users1.length).to.be.equal(3);

        // insert new entity
        const user4 = new User();
        user4.name = "Ginny";
        await connection.manager.save(user4);

        // without cache it must return really how many there entities are
        const users2 = await connection.getRepository(User).find();

        expect(users2.length).to.be.equal(4);

        // but with cache enabled it must not return newly inserted entity since cache is not expired yet
        const users3 = await connection.getRepository(User)
            .find({cache: true});
        expect(users3.length).to.be.equal(3);

        // give some time for cache to expire
        await sleep(1000);

        // now, when our cache has expired we check if we have new user inserted even with cache enabled
        const users4 = await connection.getRepository(User)
            .find({cache: true});
        expect(users4.length).to.be.equal(4);

    })));
});

runIfMain(import.meta);
