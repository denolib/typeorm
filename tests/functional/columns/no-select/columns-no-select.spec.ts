import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";

describe("columns > no-selection functionality", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not select columns marked with select: false option", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // create and save a post first
        const post = new Post();
        post.title = "About columns";
        post.text = "Some text about columns";
        post.authorName = "Umed";
        await postRepository.save(post);

        // check if all columns are updated except for readonly columns
        const loadedPost = await postRepository.findOne(post.id);
        expect(loadedPost!.title).toEqual("About columns");
        expect(loadedPost!.text).toEqual("Some text about columns");
        expect(loadedPost!.authorName).toBeUndefined();
    })));

    test("should not select columns with QueryBuilder marked with select: false option", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // create and save a post first
        const post = new Post();
        post.title = "About columns";
        post.text = "Some text about columns";
        post.authorName = "Umed";
        await postRepository.save(post);

        // check if all columns are updated except for readonly columns
        const loadedPost = await postRepository
            .createQueryBuilder("post")
            .where("post.id = :id", { id: post.id })
            .getOne();
        expect(loadedPost!.title).toEqual("About columns");
        expect(loadedPost!.text).toEqual("Some text about columns");
        expect(loadedPost!.authorName).toBeUndefined();
    })));

    test("should select columns with select: false even columns were implicitly selected", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // create and save a post first
        const post = new Post();
        post.title = "About columns";
        post.text = "Some text about columns";
        post.authorName = "Umed";
        await postRepository.save(post);

        // check if all columns are updated except for readonly columns
        const loadedPost = await postRepository
            .createQueryBuilder("post")
            .addSelect("post.authorName")
            .where("post.id = :id", { id: post.id })
            .getOne();
        expect(loadedPost!.title).toEqual("About columns");
        expect(loadedPost!.text).toEqual("Some text about columns");
        expect(loadedPost!.authorName).toEqual("Umed");
    })));

});
