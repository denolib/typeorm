import "reflect-metadata";
import {Post} from "./entity/Post";
import {Image} from "./entity/Image";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src";

describe("query builder > relational query builder > set operation > one-to-one relation", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should set entity relation of a given entity by entity objects", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.url = "image #1";
        await connection.manager.save(image1);

        const image2 = new Image();
        image2.url = "image #2";
        await connection.manager.save(image2);

        const image3 = new Image();
        image3.url = "image #3";
        await connection.manager.save(image3);

        const post1 = new Post();
        post1.title = "post #1";
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "post #2";
        await connection.manager.save(post2);

        const post3 = new Post();
        post3.title = "post #3";
        await connection.manager.save(post3);

        await connection
            .createQueryBuilder()
            .relation(Post, "image")
            .of(post1)
            .set(image1);

        let loadedPost1 = await connection.manager.findOne(Post, 1, { relations: ["image"] });
        expect(loadedPost1!.image).toEqual({ id: 1, url: "image #1" });

        let loadedPost2 = await connection.manager.findOne(Post, 2, { relations: ["image"] });
        expect(loadedPost2!.image).toBeNull();

        let loadedPost3 = await connection.manager.findOne(Post, 3, { relations: ["image"] });
        expect(loadedPost3!.image).toBeNull();

        await connection
            .createQueryBuilder()
            .relation(Post, "image")
            .of(post1)
            .set(null);

        loadedPost1 = await connection.manager.findOne(Post, 1, { relations: ["image"] });
        expect(loadedPost1!.image).toBeNull();

        loadedPost2 = await connection.manager.findOne(Post, 2, { relations: ["image"] });
        expect(loadedPost2!.image).toBeNull();

        loadedPost3 = await connection.manager.findOne(Post, 3, { relations: ["image"] });
        expect(loadedPost3!.image).toBeNull();
    })));

    test("should set entity relation of a given entity by entity id", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.url = "image #1";
        await connection.manager.save(image1);

        const image2 = new Image();
        image2.url = "image #2";
        await connection.manager.save(image2);

        const image3 = new Image();
        image3.url = "image #3";
        await connection.manager.save(image3);

        const post1 = new Post();
        post1.title = "post #1";
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "post #2";
        await connection.manager.save(post2);

        const post3 = new Post();
        post3.title = "post #3";
        await connection.manager.save(post3);

        await connection
            .createQueryBuilder()
            .relation(Post, "image")
            .of(2)
            .set(2);

        let loadedPost1 = await connection.manager.findOne(Post, 1, { relations: ["image"] });
        expect(loadedPost1!.image).toBeNull();

        let loadedPost2 = await connection.manager.findOne(Post, 2, { relations: ["image"] });
        expect(loadedPost2!.image).toEqual({ id: 2, url: "image #2" });

        let loadedPost3 = await connection.manager.findOne(Post, 3, { relations: ["image"] });
        expect(loadedPost3!.image).toBeNull();

        await connection
            .createQueryBuilder()
            .relation(Post, "image")
            .of(2)
            .set(null);

        loadedPost1 = await connection.manager.findOne(Post, 1, { relations: ["image"] });
        expect(loadedPost1!.image).toBeNull();

        loadedPost2 = await connection.manager.findOne(Post, 2, { relations: ["image"] });
        expect(loadedPost2!.image).toBeNull();

        loadedPost3 = await connection.manager.findOne(Post, 3, { relations: ["image"] });
        expect(loadedPost3!.image).toBeNull();
    })));

    test("should set entity relation of a given entity by entity id map", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.url = "image #1";
        await connection.manager.save(image1);

        const image2 = new Image();
        image2.url = "image #2";
        await connection.manager.save(image2);

        const image3 = new Image();
        image3.url = "image #3";
        await connection.manager.save(image3);

        const post1 = new Post();
        post1.title = "post #1";
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "post #2";
        await connection.manager.save(post2);

        const post3 = new Post();
        post3.title = "post #3";
        await connection.manager.save(post3);

        await connection
            .createQueryBuilder()
            .relation(Post, "image")
            .of({ id: 3 })
            .set({ id: 3 });

        let loadedPost1 = await connection.manager.findOne(Post, 1, { relations: ["image"] });
        expect(loadedPost1!.image).toBeNull();

        let loadedPost2 = await connection.manager.findOne(Post, 2, { relations: ["image"] });
        expect(loadedPost2!.image).toBeNull();

        let loadedPost3 = await connection.manager.findOne(Post, 3, { relations: ["image"] });
        expect(loadedPost3!.image).toEqual({ id: 3, url: "image #3" });

        await connection
            .createQueryBuilder()
            .relation(Post, "image")
            .of({ id: 3 })
            .set(null);

        loadedPost1 = await connection.manager.findOne(Post, 1, { relations: ["image"] });
        expect(loadedPost1!.image).toBeNull();

        loadedPost2 = await connection.manager.findOne(Post, 2, { relations: ["image"] });
        expect(loadedPost2!.image).toBeNull();

        loadedPost3 = await connection.manager.findOne(Post, 3, { relations: ["image"] });
        expect(loadedPost3!.image).toBeNull();
    })));

    test("should raise error when setting entity relation of a multiple entities", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.url = "image #1";
        await connection.manager.save(image1);

        const image2 = new Image();
        image2.url = "image #2";
        await connection.manager.save(image2);

        const image3 = new Image();
        image3.url = "image #3";
        await connection.manager.save(image3);

        const post1 = new Post();
        post1.title = "post #1";
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "post #2";
        await connection.manager.save(post2);

        const post3 = new Post();
        post3.title = "post #3";
        await connection.manager.save(post3);

        let error: null | Error = null;
        try {
            await connection
                .createQueryBuilder()
                .relation(Post, "image")
                .of([{ id: 1 }, { id: 3 }])
                .set({ id: 3 });
        } catch (e) {
            error = e;
        }

        expect(error).toBeInstanceOf(Error);

        let loadedPost1 = await connection.manager.findOne(Post, 1, { relations: ["image"] });
        expect(loadedPost1!.image).toBeNull();

        let loadedPost2 = await connection.manager.findOne(Post, 2, { relations: ["image"] });
        expect(loadedPost2!.image).toBeNull();

        let loadedPost3 = await connection.manager.findOne(Post, 3, { relations: ["image"] });
        expect(loadedPost3!.image).toBeNull();
    })));

});
