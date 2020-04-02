// This test is copied from test/functional/sqljs/auto-save.ts
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Post} from "../sqljs/entity/Post.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {createTestingConnections} from "../../utils/test-utils.ts";

describe("sqlite driver > autosave", () => {
    let connections: Connection[];
    let saves = 0;
    const callback = (database: Uint8Array) => {
        saves++;
    };

    before(async () => connections = await createTestingConnections({
        entities: [Post],
        schemaCreate: true,
        enabledDrivers: ["sqlite"],
        driverSpecific: {
            autoSaveCallback: callback,
            autoSave: true
        }
    }));

    it("should call autoSaveCallback on insert, update and delete", () => Promise.all(connections.map(async connection => {
        let posts = [
            {
                title: "second post"
            },
            {
                title: "third post"
            }
        ];

        await connection.createQueryBuilder().insert().into(Post).values(posts).execute();
        await connection.createQueryBuilder().update(Post).set({title: "Many posts"}).execute();
        await connection.createQueryBuilder().delete().from(Post).where("title = ?", {title: "third post"}).execute();

        const repository = connection.getRepository(Post);
        let post = new Post();
        post.title = "A post";
        await repository.save(post);

        let savedPost = await repository.findOne({title: "A post"});

        expect(savedPost).not.to.be.undefined;

        if (savedPost) {
            savedPost.title = "A updated post";
            await repository.save(savedPost);
            await repository.remove(savedPost);
        }

        await connection.close();

        expect(saves).to.be.equal(7);
    })));
});

describe("sqlite driver > autosave off", () => {
    let connections: Connection[];
    let saves = 0;
    const callback = (database: Uint8Array) => {
        saves++;
    };

    before(async () => connections = await createTestingConnections({
        entities: [Post],
        schemaCreate: true,
        enabledDrivers: ["sqlite"],
        driverSpecific: {
            autoSaveCallback: callback,
            autoSave: false
        }
    }));

    it("should not call autoSaveCallback when autoSave is disabled", () => Promise.all(connections.map(async connection => {
        const repository = connection.getRepository(Post);
        let post = new Post();
        post.title = "A post";
        await repository.save(post);

        let savedPost = await repository.findOne({title: "A post"});

        expect(savedPost).not.to.be.undefined;

        if (savedPost) {
            savedPost.title = "A updated post";
            await repository.save(savedPost);
            await repository.remove(savedPost);
        }

        await connection.close();

        expect(saves).to.be.equal(0);
    })));
});

runIfMain(import.meta);
