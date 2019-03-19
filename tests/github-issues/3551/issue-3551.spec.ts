import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {PromiseUtils} from "../../../src";
import { Book } from "./entity/Book";

describe("github issues > #3551 array of embedded documents through multiple levels are not handled", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mongodb"],
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should return entity with all these embedded documents", () => PromiseUtils.runInSequence(connections, async connection => {
        const bookInput = {
            title: "Book 1",
            chapters: [
                {
                    title: "Chapter 1",
                    pages: [
                        {
                            number: 1
                        },
                        {
                            number: 2
                        }
                    ]
                },
                {
                    title: "Chapter 2",
                    pages: [
                        {
                            number: 3
                        },
                        {
                            number: 4
                        }
                    ]
                }
            ]
        };

        await connection.mongoManager.getMongoRepository(Book).insert(bookInput);

        const books = await connection.mongoManager.getMongoRepository(Book).find();
        const book = books[0];

        expect(book!.title).toEqual(bookInput.title);
        expect(book!.chapters).toBeInstanceOf(2);
        expect(book!.chapters[0].title).toEqual(bookInput.chapters[0].title);
        expect(book!.chapters[0].pages).toBeInstanceOf(2);
        expect(book!.chapters[0].pages[0].number).toEqual(bookInput.chapters[0].pages[0].number);
        expect(book!.chapters[0].pages[1].number).toEqual(bookInput.chapters[0].pages[1].number);
        expect(book!.chapters[1].pages).toBeInstanceOf(2);
        expect(book!.chapters[1].pages[0].number).toEqual(bookInput.chapters[1].pages[0].number);
        expect(book!.chapters[1].pages[1].number).toEqual(bookInput.chapters[1].pages[1].number);
    }));
});
