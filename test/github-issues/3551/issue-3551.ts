import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {PromiseUtils} from "../../../src/index.ts";
import { Book, Chapter, Page } from "./entity/Book.ts";

describe("github issues > #3551 array of embedded documents through multiple levels are not handled", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Book, Chapter, Page],
            enabledDrivers: ["mongodb"],
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should return entity with all these embedded documents", () => PromiseUtils.runInSequence(connections, async connection => {
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

        book!.title.should.be.equal(bookInput.title);
        book!.chapters.should.be.lengthOf(2);
        book!.chapters[0].title.should.be.equal(bookInput.chapters[0].title);
        book!.chapters[0].pages.should.have.lengthOf(2);
        book!.chapters[0].pages[0].number.should.be.equal(bookInput.chapters[0].pages[0].number);
        book!.chapters[0].pages[1].number.should.be.equal(bookInput.chapters[0].pages[1].number);
        book!.chapters[1].pages.should.have.lengthOf(2);
        book!.chapters[1].pages[0].number.should.be.equal(bookInput.chapters[1].pages[0].number);
        book!.chapters[1].pages[1].number.should.be.equal(bookInput.chapters[1].pages[1].number);
    }));
});

runIfMain(import.meta);
