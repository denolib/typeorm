import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {Counters} from "./entity/Counters";
import {Subcounters} from "./entity/Subcounters";

describe("metadata-builder > ColumnMetadata", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("getValue", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.id = 1;
        post.title = "Post #1";
        post.counters = new Counters();
        post.counters.code = 123;
        post.counters.likes = 2;
        post.counters.comments = 3;
        post.counters.favorites = 4;
        post.counters.subcounters = new Subcounters();
        post.counters.subcounters.version = 1;
        post.counters.subcounters.watches = 10;

        const titleColumnMetadata = connection.getMetadata(Post).columns.find(column => column.propertyName === "title");
        expect(titleColumnMetadata).not.toBeUndefined();
        expect(titleColumnMetadata!.getEntityValue(post)).toEqual("Post #1");

        const codeColumnMetadata = connection.getMetadata(Post).columns.find(column => column.propertyName === "code");
        expect(codeColumnMetadata).not.toBeUndefined();
        expect(codeColumnMetadata!.getEntityValue(post)).toEqual(123);

        const watchesColumnMetadata = connection.getMetadata(Post).columns.find(column => column.propertyName === "watches");
        expect(watchesColumnMetadata).not.toBeUndefined();
        expect(watchesColumnMetadata!.getEntityValue(post)).toEqual(10);

    })));

    test                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ("getValueMap", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.id = 1;
        post.title = "Post #1";
        post.counters = new Counters();
        post.counters.code = 123;
        post.counters.likes = 2;
        post.counters.comments = 3;
        post.counters.favorites = 4;
        post.counters.subcounters = new Subcounters();
        post.counters.subcounters.version = 1;
        post.counters.subcounters.watches = 10;

        const titleColumnMetadata = connection.getMetadata(Post).columns.find(column => column.propertyName === "title");
        expect(titleColumnMetadata).not.toBeUndefined();
        expect(titleColumnMetadata!.getEntityValueMap(post)).toEqual({ title: "Post #1" });
        expect(titleColumnMetadata!.getEntityValueMap({ id: 1 })).toBeUndefined();

        const codeColumnMetadata = connection.getMetadata(Post).columns.find(column => column.propertyName === "code");
        expect(codeColumnMetadata).not.toBeUndefined();
        expect(codeColumnMetadata!.getEntityValueMap(post)).toEqual({ counters: { code: 123 } });
        expect(codeColumnMetadata!.getEntityValueMap({ id: 1 })).toBeUndefined();
        expect(codeColumnMetadata!.getEntityValueMap({ id: 1, counters: undefined })).toBeUndefined();
        expect(codeColumnMetadata!.getEntityValueMap({ id: 1, counters: { } })).toBeUndefined();
        expect(codeColumnMetadata!.getEntityValueMap({ id: 1, counters: { code: undefined } })).toBeUndefined();
        expect(codeColumnMetadata!.getEntityValueMap({ id: 1, counters: { code: null } })).toEqual({ counters: { code: null } });
        expect(codeColumnMetadata!.getEntityValueMap({ id: 1, counters: { code: 0 } })).toEqual({ counters: { code: 0 } });
        expect(codeColumnMetadata!.getEntityValueMap({ id: 1, counters: { likes: 123 } })).toBeUndefined();

        const watchesColumnMetadata = connection.getMetadata(Post).columns.find(column => column.propertyName === "watches");
        expect(watchesColumnMetadata).not.toBeUndefined();
        expect(watchesColumnMetadata!.getEntityValueMap(post)).toEqual({ counters: { subcounters: { watches: 10 } } });
        expect(watchesColumnMetadata!.getEntityValueMap({ id: 1 })).toEqual(undefined);
        expect(watchesColumnMetadata!.getEntityValueMap({ id: 1, counters: undefined })).toBeUndefined();
        expect(watchesColumnMetadata!.getEntityValueMap({ id: 1, counters: { } })).toBeUndefined();
        expect(watchesColumnMetadata!.getEntityValueMap({ id: 1, counters: { subcounters: undefined } })).toBeUndefined();
        expect(watchesColumnMetadata!.getEntityValueMap({ id: 1, counters: { subcounters: { watches: null } } })).toEqual({ counters: { subcounters: { watches: null } } });
        expect(watchesColumnMetadata!.getEntityValueMap({ id: 1, counters: { subcounters: { watches: 0 } } })).toEqual({ counters: { subcounters: { watches: 0 } } });
        expect(watchesColumnMetadata!.getEntityValueMap({ id: 1, counters: { subcounters: { version: 123 } } })).toBeUndefined();

    })));

});
