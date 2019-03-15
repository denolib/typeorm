import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import { PhoneBook } from "./entity/PhoneBook";
import {Post} from "./entity/Post";

describe("columns > value-transformer functionality", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post, PhoneBook],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should marshal data using the provided value-transformer", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);

        // create and save a post first
        const post = new Post();
        post.title = "About columns";
        post.tags = ["simple", "transformer"];
        await postRepository.save(post);

        // then update all its properties and save again
        post.title = "About columns1";
        post.tags = ["very", "simple"];
        await postRepository.save(post);

        // check if all columns are updated except for readonly columns
        const loadedPost = await postRepository.findOne(post.id);
        expect(loadedPost!.title).toEqual("About columns1");
        expect(loadedPost!.tags).toEqual(["very", "simple"]);


        const phoneBookRepository = connection.getRepository(PhoneBook);
        const phoneBook = new PhoneBook();
        phoneBook.name = "George";
        phoneBook.phones = new Map();
        phoneBook.phones.set("work", 123456);
        phoneBook.phones.set("mobile", 1234567);
        await phoneBookRepository.save(phoneBook);

        const loadedPhoneBook = await phoneBookRepository.findOne(phoneBook.id);
        expect(loadedPhoneBook!.name).toEqual("George");
        expect(loadedPhoneBook!.phones).not.toBeUndefined();
        expect(loadedPhoneBook!.phones.get("work")).toEqual(123456);
        expect(loadedPhoneBook!.phones.get("mobile")).toEqual(1234567);


    })));


});
