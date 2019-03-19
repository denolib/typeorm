import "reflect-metadata";
import {Connection} from "../../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../utils/test-utils";
import {Post} from "./entity/Post";
import {PostWithOptions} from "./entity/PostWithOptions";
import {PostWithoutTypes} from "./entity/PostWithoutTypes";

describe("database schema > column types > cockroachdb", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["cockroachdb"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("all types should work correctly - persist and hydrate", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        const post = new Post();
        post.id = 1;
        post.name = "Post";
        post.integer = "2147483647";
        post.int4 = "2147483647";
        post.int = "2147483647";
        post.smallint = "32767";
        post.int2 = "32767";
        post.bigint = "8223372036854775807";
        post.int8 = "8223372036854775807";
        post.int64 = "8223372036854775807";
        post.doublePrecision = 15.357;
        post.float8 = 15.357;
        post.real = 5.5;
        post.float4 = 5.5;
        post.numeric = "50";
        post.decimal = "50";
        post.dec = "50";
        post.char = "A";
        post.character = "A";
        post.varchar = "This is varchar";
        post.charVarying = "This is char varying";
        post.characterVarying = "This is character varying";
        post.text = "This is text";
        post.string = "This is string";
        post.bytes = Buffer.alloc(13, "This is bytes");
        post.bytea = Buffer.alloc(13, "This is bytea");
        post.blob = Buffer.alloc(12, "This is blob");
        post.date = "2017-06-21";
        post.interval = "1 year 2 months 3 days 4 hours 5 minutes 6 seconds";
        post.time = "05:40:00.000001";
        post.timeWithoutTimeZone = "05:40:00.000001";
        post.timestamp = new Date();
        post.timestamp.setMilliseconds(0);
        post.timestampWithTimeZone = new Date();
        post.timestampWithTimeZone.setMilliseconds(0);
        post.timestampWithoutTimeZone = new Date();
        post.timestampWithoutTimeZone.setMilliseconds(0);
        post.timestamptz = new Date();
        post.timestamptz.setMilliseconds(0);
        post.boolean = true;
        post.bool = false;
        post.inet = "192.168.100.128";
        post.uuid = "0e37df36-f698-11e6-8dd4-cb9ced3df976";
        post.jsonb = { id: 1, name: "Post" };
        post.json = { id: 1, name: "Post" };
        post.array = ["1", "2", "3"];
        post.simpleArray = ["A", "B", "C"];
        post.simpleJson = { param: "VALUE" };
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.name).toEqual(post.name);
        expect(loadedPost.integer).toEqual(post.integer);
        expect(loadedPost.int4).toEqual(post.int4);
        expect(loadedPost.int).toEqual(post.int);
        expect(loadedPost.smallint).toEqual(post.smallint);
        expect(loadedPost.int2).toEqual(post.int2);
        expect(loadedPost.bigint).toEqual(post.bigint);
        expect(loadedPost.int8).toEqual(post.int8);
        expect(loadedPost.int64).toEqual(post.int64);
        expect(loadedPost.doublePrecision).toEqual(post.doublePrecision);
        expect(loadedPost.float8).toEqual(post.float8);
        expect(loadedPost.real).toEqual(post.real);
        expect(loadedPost.float4).toEqual(post.float4);
        expect(loadedPost.numeric).toEqual(post.numeric);
        expect(loadedPost.decimal).toEqual(post.decimal);
        expect(loadedPost.dec).toEqual(post.dec);
        expect(loadedPost.char).toEqual(post.char);
        expect(loadedPost.character).toEqual(post.character);
        expect(loadedPost.varchar).toEqual(post.varchar);
        expect(loadedPost.characterVarying).toEqual(post.characterVarying);
        expect(loadedPost.text).toEqual(post.text);
        expect(loadedPost.bytes.toString()).toEqual(post.bytes.toString());
        expect(loadedPost.bytea.toString()).toEqual(post.bytea.toString());
        expect(loadedPost.blob.toString()).toEqual(post.blob.toString());
        expect(loadedPost.date).toEqual(post.date);
        // expect(loadedPost.interval.years).toEqual(1);
        // expect(loadedPost.interval.months).toEqual(2);
        // expect(loadedPost.interval.days).toEqual(3);
        // expect(loadedPost.interval.hours).toEqual(4);
        // expect(loadedPost.interval.minutes).toEqual(5);
        // expect(loadedPost.interval.seconds).toEqual(6);
        expect(loadedPost.time).toEqual(post.time);
        expect(loadedPost.timeWithoutTimeZone).toEqual(post.timeWithoutTimeZone);
        expect(loadedPost.timestamp.valueOf()).toEqual(post.timestamp.valueOf());
        expect(loadedPost.timestampWithTimeZone.getTime()).toEqual(post.timestampWithTimeZone.getTime());
        expect(loadedPost.timestampWithoutTimeZone.getTime()).toEqual(post.timestampWithoutTimeZone.getTime());
        expect(loadedPost.timestamptz.valueOf()).toEqual(post.timestamptz.valueOf());
        expect(loadedPost.boolean).toEqual(post.boolean);
        expect(loadedPost.bool).toEqual(post.bool);
        expect(loadedPost.inet).toEqual(post.inet);
        expect(loadedPost.uuid).toEqual(post.uuid);
        expect(loadedPost.jsonb).toEqual(post.jsonb);
        expect(loadedPost.json).toEqual(post.json);
        expect(loadedPost.array[0]).toEqual(post.array[0]);
        expect(loadedPost.array[1]).toEqual(post.array[1]);
        expect(loadedPost.array[2]).toEqual(post.array[2]);
        expect(loadedPost.simpleArray[0]).toEqual(post.simpleArray[0]);
        expect(loadedPost.simpleArray[1]).toEqual(post.simpleArray[1]);
        expect(loadedPost.simpleArray[2]).toEqual(post.simpleArray[2]);
        expect(loadedPost.simpleJson.param).toEqual(post.simpleJson.param);

        expect(table!.findColumnByName("id")!.type).toEqual("int");
        expect(table!.findColumnByName("name")!.type).toEqual("varchar");
        expect(table!.findColumnByName("integer")!.type).toEqual("int");
        expect(table!.findColumnByName("int4")!.type).toEqual("int");
        expect(table!.findColumnByName("int")!.type).toEqual("int");
        expect(table!.findColumnByName("smallint")!.type).toEqual("int2");
        expect(table!.findColumnByName("int2")!.type).toEqual("int2");
        expect(table!.findColumnByName("bigint")!.type).toEqual("int8");
        expect(table!.findColumnByName("int8")!.type).toEqual("int8");
        expect(table!.findColumnByName("int64")!.type).toEqual("int8");
        expect(table!.findColumnByName("doublePrecision")!.type).toEqual("float8");
        expect(table!.findColumnByName("float8")!.type).toEqual("float8");
        expect(table!.findColumnByName("real")!.type).toEqual("float4");
        expect(table!.findColumnByName("float4")!.type).toEqual("float4");
        expect(table!.findColumnByName("numeric")!.type).toEqual("decimal");
        expect(table!.findColumnByName("decimal")!.type).toEqual("decimal");
        expect(table!.findColumnByName("dec")!.type).toEqual("decimal");
        expect(table!.findColumnByName("char")!.type).toEqual("char");
        expect(table!.findColumnByName("character")!.type).toEqual("char");
        expect(table!.findColumnByName("varchar")!.type).toEqual("varchar");
        expect(table!.findColumnByName("characterVarying")!.type).toEqual("varchar");
        expect(table!.findColumnByName("charVarying")!.type).toEqual("varchar");
        expect(table!.findColumnByName("text")!.type).toEqual("string");
        expect(table!.findColumnByName("string")!.type).toEqual("string");
        expect(table!.findColumnByName("bytes")!.type).toEqual("bytes");
        expect(table!.findColumnByName("bytea")!.type).toEqual("bytes");
        expect(table!.findColumnByName("blob")!.type).toEqual("bytes");
        expect(table!.findColumnByName("date")!.type).toEqual("date");
        expect(table!.findColumnByName("interval")!.type).toEqual("interval");
        expect(table!.findColumnByName("time")!.type).toEqual("time");
        expect(table!.findColumnByName("timeWithoutTimeZone")!.type).toEqual("time");
        expect(table!.findColumnByName("timestamp")!.type).toEqual("timestamp");
        expect(table!.findColumnByName("timestampWithTimeZone")!.type).toEqual("timestamptz");
        expect(table!.findColumnByName("timestampWithoutTimeZone")!.type).toEqual("timestamp");
        expect(table!.findColumnByName("timestamptz")!.type).toEqual("timestamptz");
        expect(table!.findColumnByName("boolean")!.type).toEqual("bool");
        expect(table!.findColumnByName("bool")!.type).toEqual("bool");
        expect(table!.findColumnByName("inet")!.type).toEqual("inet");
        expect(table!.findColumnByName("uuid")!.type).toEqual("uuid");
        expect(table!.findColumnByName("jsonb")!.type).toEqual("jsonb");
        expect(table!.findColumnByName("json")!.type).toEqual("jsonb");
        expect(table!.findColumnByName("array")!.type).toEqual("int");
        expect(table!.findColumnByName("array")!.isArray!).toBeTruthy();
        expect(table!.findColumnByName("simpleArray")!.type).toEqual("string");
        expect(table!.findColumnByName("simpleJson")!.type).toEqual("string");

    })));

    test("all types should work correctly - persist and hydrate when options are specified on columns", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(PostWithOptions);
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post_with_options");
        await queryRunner.release();

        const post = new PostWithOptions();
        post.id = 1;
        post.numeric = "50.00";
        post.decimal = "50.00";
        post.dec = "50.00";
        post.char = "AAA";
        post.character = "AAA";
        post.varchar = "This is varchar";
        post.characterVarying = "This is character varying";
        post.charVarying = "This is char varying";
        post.string = "This is string";
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.numeric).toEqual(post.numeric);
        expect(loadedPost.decimal).toEqual(post.decimal);
        expect(loadedPost.char).toEqual(post.char);
        expect(loadedPost.character).toEqual(post.character);
        expect(loadedPost.varchar).toEqual(post.varchar);
        expect(loadedPost.characterVarying).toEqual(post.characterVarying);
        expect(loadedPost.charVarying).toEqual(post.charVarying);
        expect(loadedPost.string).toEqual(post.string);

        expect(table!.findColumnByName("id")!.type).toEqual("int");
        expect(table!.findColumnByName("numeric")!.type).toEqual("decimal");
        expect(table!.findColumnByName("numeric")!.precision!).toEqual(5);
        expect(table!.findColumnByName("numeric")!.scale!).toEqual(2);
        expect(table!.findColumnByName("decimal")!.type).toEqual("decimal");
        expect(table!.findColumnByName("decimal")!.precision!).toEqual(5);
        expect(table!.findColumnByName("decimal")!.scale!).toEqual(2);
        expect(table!.findColumnByName("dec")!.type).toEqual("decimal");
        expect(table!.findColumnByName("dec")!.precision!).toEqual(5);
        expect(table!.findColumnByName("dec")!.scale!).toEqual(2);
        expect(table!.findColumnByName("char")!.type).toEqual("char");
        expect(table!.findColumnByName("char")!.length!).toEqual("3");
        expect(table!.findColumnByName("character")!.type).toEqual("char");
        expect(table!.findColumnByName("character")!.length!).toEqual("3");
        expect(table!.findColumnByName("varchar")!.type).toEqual("varchar");
        expect(table!.findColumnByName("varchar")!.length!).toEqual("30");
        expect(table!.findColumnByName("characterVarying")!.type).toEqual("varchar");
        expect(table!.findColumnByName("characterVarying")!.length!).toEqual("30");
        expect(table!.findColumnByName("charVarying")!.type).toEqual("varchar");
        expect(table!.findColumnByName("charVarying")!.length!).toEqual("30");
        expect(table!.findColumnByName("string")!.type).toEqual("string");
        expect(table!.findColumnByName("string")!.length!).toEqual("30");

    })));

    test("all types should work correctly - persist and hydrate when types are not specified on columns", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(PostWithoutTypes);
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post_without_types");
        await queryRunner.release();

        const post = new PostWithoutTypes();
        post.id = 1;
        post.name = "Post";
        post.boolean = true;
        post.datetime = new Date();
        post.datetime.setMilliseconds(0);
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.name).toEqual(post.name);
        expect(loadedPost.boolean).toEqual(post.boolean);
        expect(loadedPost.datetime.valueOf()).toEqual(post.datetime.valueOf());

        expect(table!.findColumnByName("id")!.type).toEqual("int");
        expect(table!.findColumnByName("name")!.type).toEqual("varchar");
        expect(table!.findColumnByName("boolean")!.type).toEqual("bool");
        expect(table!.findColumnByName("datetime")!.type).toEqual("timestamp");

    })));

});
