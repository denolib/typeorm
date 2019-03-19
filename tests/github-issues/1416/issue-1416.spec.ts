import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Author} from "./entity/Author";
import {Photo} from "./entity/Photo";
import {Connection} from "../../../src";
import {PhotoMetadata} from "./entity/PhotoMetadata";

describe("github issue > #1416 Wrong behavior when fetching an entity that has a relation with its own eager relations", () => {
    let connections: Connection[] = [];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should load eager relations of an entity's relations recursively", () => Promise.all(connections.map(async connection => {
        const metadata = new PhotoMetadata();
        metadata.height = 640;
        metadata.width = 480;
        metadata.compressed = true;
        metadata.comment = "cybershoot";
        metadata.orientation = "portait";
        await connection.manager.save(metadata);

        const photo = new Photo();
        photo.name = "Me and Bears";
        photo.description = "I am near polar bears";
        photo.filename = "photo-with-bears.jpg";
        photo.isPublished = true;
        photo.metadata = metadata;
        await connection.manager.save(photo);

        let photoAuthor = new Author();
        photoAuthor.name = "John Doe";
        photoAuthor.photos = [photo];
        await connection.manager.save(photoAuthor);

        const author = await connection.manager.findOne(Author, { 
            where: { 
                name: photoAuthor.name
            }, 
            relations: ["photos"] 
        }) as Author;
        expect(author).not.toBeUndefined();
        expect(author.photos[0]).not.toBeUndefined();
        expect(author.photos[0]).toEqual(photo);
        expect(author.photos[0].metadata).not.toBeUndefined();
        expect(author.photos[0].metadata).toEqual(metadata);
    })));
});
