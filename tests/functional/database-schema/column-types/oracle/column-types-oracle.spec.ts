import "reflect-metadata";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../utils/test-utils";
import {Post} from "./entity/Post";
import {Connection} from "../../../../../src";
import {PostWithOptions} from "./entity/PostWithOptions";
import {PostWithoutTypes} from "./entity/PostWithoutTypes";
import {DateUtils} from "../../../../../src/util/DateUtils";

describe("database schema > column types > oracle", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["oracle"],
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
        post.number = 32767;
        post.numeric = 32767;
        post.float = 10.53;
        post.dec = 100;
        post.decimal = 50;
        post.int = 2147483647;
        post.integer = 2147483647;
        post.smallint = 32767;
        post.real = 10.5;
        post.doublePrecision = 15.35;
        post.char = "A";
        post.nchar = "A";
        post.varchar2 = "This is varchar2";
        post.nvarchar2 = "This is nvarchar2";
        post.long = "This is long";
        post.raw = new Buffer("This is raw");
        post.dateObj = new Date();
        post.date = "2017-06-21";
        post.timestamp = new Date();
        post.timestamp.setMilliseconds(0);
        post.timestampWithTimeZone = new Date();
        post.timestampWithTimeZone.setMilliseconds(0);
        post.timestampWithLocalTimeZone = new Date();
        post.timestampWithLocalTimeZone.setMilliseconds(0);
        post.blob = new Buffer("This is blob");
        post.clob = "This is clob";
        post.nclob = "This is nclob";
        post.simpleArray = ["A", "B", "C"];
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.name).toEqual(post.name);
        expect(loadedPost.number).toEqual(post.number);
        expect(loadedPost.numeric).toEqual(post.numeric);
        expect(loadedPost.float).toEqual(post.float);
        expect(loadedPost.dec).toEqual(post.dec);
        expect(loadedPost.decimal).toEqual(post.decimal);
        expect(loadedPost.int).toEqual(post.int);
        expect(loadedPost.integer).toEqual(post.integer);
        expect(loadedPost.smallint).toEqual(post.smallint);
        expect(loadedPost.real).toEqual(post.real);
        expect(loadedPost.doublePrecision).toEqual(post.doublePrecision);
        expect(loadedPost.char).toEqual(post.char);
        expect(loadedPost.nchar).toEqual(post.nchar);
        expect(loadedPost.varchar2).toEqual(post.varchar2);
        expect(loadedPost.nvarchar2).toEqual(post.nvarchar2);
        expect(loadedPost.long).toEqual(post.long);
        expect(loadedPost.raw).toEqual(post.raw);
        expect(loadedPost.dateObj).toEqual(DateUtils.mixedDateToDateString(post.dateObj));
        expect(loadedPost.date).toEqual(post.date);
        expect(loadedPost.timestamp.valueOf()).toEqual(post.timestamp.valueOf());
        expect(loadedPost.timestampWithTimeZone.valueOf()).toEqual(post.timestampWithTimeZone.valueOf());
        expect(loadedPost.timestampWithLocalTimeZone.valueOf()).toEqual(post.timestampWithLocalTimeZone.valueOf());
        expect(loadedPost.blob.toString()).toEqual(post.blob.toString());
        expect(loadedPost.clob.toString()).toEqual(post.clob.toString());
        expect(loadedPost.nclob.toString()).toEqual(post.nclob.toString());
        expect(loadedPost.simpleArray[0]).toEqual(post.simpleArray[0]);
        expect(loadedPost.simpleArray[1]).toEqual(post.simpleArray[1]);
        expect(loadedPost.simpleArray[2]).toEqual(post.simpleArray[2]);

        expect(table!.findColumnByName("id")!.type).toEqual("number");
        expect(table!.findColumnByName("name")!.type).toEqual("varchar2");
        expect(table!.findColumnByName("number")!.type).toEqual("number");
        expect(table!.findColumnByName("numeric")!.type).toEqual("number");
        expect(table!.findColumnByName("float")!.type).toEqual("float");
        expect(table!.findColumnByName("dec")!.type).toEqual("number");
        expect(table!.findColumnByName("decimal")!.type).toEqual("number");
        expect(table!.findColumnByName("int")!.type).toEqual("number");
        expect(table!.findColumnByName("integer")!.type).toEqual("number");
        expect(table!.findColumnByName("real")!.type).toEqual("float");
        expect(table!.findColumnByName("smallint")!.type).toEqual("number");
        expect(table!.findColumnByName("doublePrecision")!.type).toEqual("float");
        expect(table!.findColumnByName("char")!.type).toEqual("char");
        expect(table!.findColumnByName("nchar")!.type).toEqual("nchar");
        expect(table!.findColumnByName("varchar2")!.type).toEqual("varchar2");
        expect(table!.findColumnByName("nvarchar2")!.type).toEqual("nvarchar2");
        expect(table!.findColumnByName("long")!.type).toEqual("long");
        expect(table!.findColumnByName("raw")!.type).toEqual("raw");
        expect(table!.findColumnByName("date")!.type).toEqual("date");
        expect(table!.findColumnByName("dateObj")!.type).toEqual("date");
        expect(table!.findColumnByName("timestamp")!.type).toEqual("timestamp");
        expect(table!.findColumnByName("timestampWithTimeZone")!.type).toEqual("timestamp with time zone");
        expect(table!.findColumnByName("timestampWithLocalTimeZone")!.type).toEqual("timestamp with local time zone");
        expect(table!.findColumnByName("blob")!.type).toEqual("blob");
        expect(table!.findColumnByName("clob")!.type).toEqual("clob");
        expect(table!.findColumnByName("nclob")!.type).toEqual("nclob");
        expect(table!.findColumnByName("simpleArray")!.type).toEqual("clob");

    })));

    test("all types should work correctly - persist and hydrate when options are specified on columns", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(PostWithOptions);
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post_with_options");
        await queryRunner.release();

        const post = new PostWithOptions();
        post.id = 1;
        post.number = 50;
        post.numeric = 50;
        post.float = 5.25;
        post.dec = 60;
        post.decimal = 70;
        post.char = "AAA";
        post.nchar = "AAA";
        post.varchar2 = "This is varchar";
        post.nvarchar2 = "This is nvarchar";
        post.raw = new Buffer("This is raw");
        post.timestamp = new Date();
        post.timestampWithTimeZone = new Date();
        post.timestampWithLocalTimeZone = new Date();
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.number).toEqual(post.number);
        expect(loadedPost.numeric).toEqual(post.numeric);
        expect(loadedPost.float).toEqual(post.float);
        expect(loadedPost.dec).toEqual(post.dec);
        expect(loadedPost.decimal).toEqual(post.decimal);
        expect(loadedPost.char).toEqual(post.char);
        expect(loadedPost.nchar).toEqual(post.nchar);
        expect(loadedPost.varchar2).toEqual(post.varchar2);
        expect(loadedPost.nvarchar2).toEqual(post.nvarchar2);
        expect(loadedPost.raw).toEqual(post.raw);
        expect(loadedPost.timestamp.getTime()).toEqual(post.timestamp.getTime());
        expect(loadedPost.timestampWithTimeZone.getTime()).toEqual(post.timestampWithTimeZone.getTime());
        expect(loadedPost.timestampWithLocalTimeZone.getTime()).toEqual(post.timestampWithLocalTimeZone.getTime());

        expect(table!.findColumnByName("id")!.type).toEqual("number");
        expect(table!.findColumnByName("number")!.type).toEqual("number");
        expect(table!.findColumnByName("number")!.precision!).toEqual(10);
        expect(table!.findColumnByName("number")!.scale!).toEqual(5);
        expect(table!.findColumnByName("numeric")!.type).toEqual("number");
        expect(table!.findColumnByName("numeric")!.precision!).toEqual(10);
        expect(table!.findColumnByName("numeric")!.scale!).toEqual(5);
        expect(table!.findColumnByName("float")!.type).toEqual("float");
        expect(table!.findColumnByName("float")!.precision!).toEqual(24);
        expect(table!.findColumnByName("dec")!.type).toEqual("number");
        expect(table!.findColumnByName("dec")!.precision!).toEqual(10);
        expect(table!.findColumnByName("dec")!.scale!).toEqual(5);
        expect(table!.findColumnByName("decimal")!.type).toEqual("number");
        expect(table!.findColumnByName("decimal")!.precision!).toEqual(10);
        expect(table!.findColumnByName("decimal")!.scale!).toEqual(5);
        expect(table!.findColumnByName("char")!.type).toEqual("char");
        expect(table!.findColumnByName("char")!.length!).toEqual("3");
        expect(table!.findColumnByName("nchar")!.type).toEqual("nchar");
        expect(table!.findColumnByName("nchar")!.length!).toEqual("3");
        expect(table!.findColumnByName("varchar2")!.type).toEqual("varchar2");
        expect(table!.findColumnByName("varchar2")!.length!).toEqual("50");
        expect(table!.findColumnByName("nvarchar2")!.type).toEqual("nvarchar2");
        expect(table!.findColumnByName("nvarchar2")!.length!).toEqual("40");
        expect(table!.findColumnByName("raw")!.type).toEqual("raw");
        expect(table!.findColumnByName("raw")!.length!).toEqual("500");
        expect(table!.findColumnByName("timestamp")!.type).toEqual("timestamp");
        expect(table!.findColumnByName("timestamp")!.precision!).toEqual(5);
        expect(table!.findColumnByName("timestampWithTimeZone")!.type).toEqual("timestamp with time zone");
        expect(table!.findColumnByName("timestampWithTimeZone")!.precision!).toEqual(6);
        expect(table!.findColumnByName("timestampWithLocalTimeZone")!.type).toEqual("timestamp with local time zone");
        expect(table!.findColumnByName("timestampWithLocalTimeZone")!.precision!).toEqual(7);

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
        post.blob = new Buffer("This is blob");
        post.datetime = new Date();
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.name).toEqual(post.name);
        expect(loadedPost.boolean).toEqual(post.boolean);
        expect(loadedPost.blob.toString()).toEqual(post.blob.toString());
        expect(loadedPost.datetime.getTime()).toEqual(post.datetime.getTime());

        expect(table!.findColumnByName("id")!.type).toEqual("number");
        expect(table!.findColumnByName("name")!.type).toEqual("varchar2");
        expect(table!.findColumnByName("boolean")!.type).toEqual("number");
        expect(table!.findColumnByName("blob")!.type).toEqual("blob");
        expect(table!.findColumnByName("datetime")!.type).toEqual("timestamp");

    })));

});
