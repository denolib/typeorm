import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Author} from "./entity/Author.ts";
import {Photo} from "./entity/Photo.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {PhotoMetadata} from "./entity/PhotoMetadata.ts";

describe("github issue > #1416 Wrong behavior when fetching an entity that has a relation with its own eager relations", () => {
    let connections: Connection[] = [];
    before(async () => connections = await createTestingConnections({
        entities: [Author, Photo, PhotoMetadata],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should load eager relations of an entity's relations recursively", () => Promise.all(connections.map(async connection => {
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
        expect(author).not.to.be.undefined;
        expect(author.photos[0]).not.to.be.undefined;
        expect(author.photos[0]).to.eql(photo);
        expect(author.photos[0].metadata).not.to.be.undefined;
        expect(author.photos[0].metadata).to.eql(metadata);
    })));
});

runIfMain(import.meta);
