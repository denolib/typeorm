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
import {FruitEnum} from "./enum/FruitEnum";

describe("database schema > column types > mssql", () => { // https://github.com/tediousjs/tedious/issues/722

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mssql"],
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
        post.bit = true;
        post.tinyint = 127;
        post.smallint = 32767;
        post.int = 2147483647;
        post.bigint = "9007199254740991";
        post.decimal = 50;
        post.dec = 100;
        post.numeric = 10;
        post.float = 10.53;
        post.real = 10.5;
        post.smallmoney = 100;
        post.money = 2500;
        post.uniqueidentifier = "FD357B8F-8838-42F6-B7A2-AE027444E895";
        post.char = "A";
        post.varchar = "This is varchar";
        post.text = "This is text";
        post.nchar = "A";
        post.nvarchar = "This is nvarchar";
        post.ntext = "This is ntext";
        post.binary = new Buffer("A");
        post.varbinary = new Buffer("B");
        post.image = new Buffer("This is image");
        post.dateObj = new Date();
        post.date = "2017-06-21";
        post.datetime = new Date();
        post.datetime.setMilliseconds(0); // set milliseconds to zero because the SQL Server datetime type only has a 1/300 ms (~3.33̅ ms) resolution
        post.datetime2 = new Date();
        post.smalldatetime = new Date();
        post.smalldatetime.setSeconds(0); // set seconds to zero because smalldatetime type rounds seconds
        post.smalldatetime.setMilliseconds(0); // set milliseconds to zero because smalldatetime type does not stores milliseconds
        post.timeObj = new Date();
        post.time = "15:30:00";
        post.datetimeoffset = new Date();
        post.geometry1 = "LINESTRING (100 100, 20 180, 180 180)";
        post.geometry2 = "POLYGON ((0 0, 150 0, 150 150, 0 150, 0 0))";
        post.geometry3 = "GEOMETRYCOLLECTION (POINT (4 0), LINESTRING (4 2, 5 3), POLYGON ((0 0, 3 0, 3 3, 0 3, 0 0), (1 1, 1 2, 2 2, 2 1, 1 1)))";
        post.simpleArray = ["A", "B", "C"];
        post.simpleJson = { param: "VALUE" };
        post.simpleEnum = "A";
        post.simpleClassEnum1 = FruitEnum.Apple;
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.name).toEqual(post.name);
        expect(loadedPost.bit).toEqual(post.bit);
        expect(loadedPost.smallint).toEqual(post.smallint);
        expect(loadedPost.tinyint).toEqual(post.tinyint);
        expect(loadedPost.int).toEqual(post.int);
        expect(loadedPost.bigint).toEqual(post.bigint);
        expect(loadedPost.decimal).toEqual(post.decimal);
        expect(loadedPost.dec).toEqual(post.dec);
        expect(loadedPost.numeric).toEqual(post.numeric);
        expect(loadedPost.float).toEqual(post.float);
        expect(loadedPost.real).toEqual(post.real);
        expect(loadedPost.smallmoney).toEqual(post.smallmoney);
        expect(loadedPost.money).toEqual(post.money);
        expect(loadedPost.uniqueidentifier).toEqual(post.uniqueidentifier);
        expect(loadedPost.char).toEqual(post.char);
        expect(loadedPost.varchar).toEqual(post.varchar);
        expect(loadedPost.text).toEqual(post.text);
        expect(loadedPost.nchar).toEqual(post.nchar);
        expect(loadedPost.nvarchar).toEqual(post.nvarchar);
        expect(loadedPost.ntext).toEqual(post.ntext);
        expect(loadedPost.binary.toString()).toEqual(post.binary.toString());
        expect(loadedPost.varbinary.toString()).toEqual(post.varbinary.toString());
        expect(loadedPost.image.toString()).toEqual(post.image.toString());
        expect(loadedPost.rowversion).not.toBeNull();
        expect(loadedPost.rowversion).toBeDefined();
        expect(loadedPost.dateObj).toEqual(DateUtils.mixedDateToDateString(post.dateObj));
        expect(loadedPost.date).toEqual(post.date);
        // commented because mssql inserted milliseconds are not always equal to what we say it to insert
        // commented to prevent CI failings
        // expect(loadedPost.datetime.getTime()).toEqual(post.datetime.getTime());
        // expect(loadedPost.datetime2.getTime()).toEqual(post.datetime2.getTime());
        // expect(loadedPost.datetimeoffset.getTime()).toEqual(post.datetimeoffset.getTime());
        expect(loadedPost.geometry1).toEqual(post.geometry1);
        expect(loadedPost.geometry2).toEqual(post.geometry2);
        expect(loadedPost.geometry3).toEqual(post.geometry3);
        expect(loadedPost.smalldatetime.getTime()).toEqual(post.smalldatetime.getTime());
        expect(loadedPost.timeObj).toEqual(DateUtils.mixedTimeToString(post.timeObj));
        expect(loadedPost.time).toEqual(post.time);
        expect(loadedPost.simpleArray[0]).toEqual(post.simpleArray[0]);
        expect(loadedPost.simpleArray[1]).toEqual(post.simpleArray[1]);
        expect(loadedPost.simpleArray[2]).toEqual(post.simpleArray[2]);
        expect(loadedPost.simpleJson.param).toEqual(post.simpleJson.param);
        expect(loadedPost.simpleEnum).toEqual(post.simpleEnum);
        expect(loadedPost.simpleClassEnum1).toEqual(post.simpleClassEnum1);

        expect(table!.findColumnByName("id")!.type).toEqual("int");
        expect(table!.findColumnByName("name")!.type).toEqual("nvarchar");
        expect(table!.findColumnByName("bit")!.type).toEqual("bit");
        expect(table!.findColumnByName("tinyint")!.type).toEqual("tinyint");
        expect(table!.findColumnByName("smallint")!.type).toEqual("smallint");
        expect(table!.findColumnByName("int")!.type).toEqual("int");
        expect(table!.findColumnByName("bigint")!.type).toEqual("bigint");
        expect(table!.findColumnByName("decimal")!.type).toEqual("decimal");
        expect(table!.findColumnByName("dec")!.type).toEqual("decimal");
        expect(table!.findColumnByName("numeric")!.type).toEqual("numeric");
        expect(table!.findColumnByName("float")!.type).toEqual("float");
        expect(table!.findColumnByName("real")!.type).toEqual("real");
        expect(table!.findColumnByName("smallmoney")!.type).toEqual("smallmoney");
        expect(table!.findColumnByName("money")!.type).toEqual("money");
        expect(table!.findColumnByName("uniqueidentifier")!.type).toEqual("uniqueidentifier");
        expect(table!.findColumnByName("char")!.type).toEqual("char");
        expect(table!.findColumnByName("varchar")!.type).toEqual("varchar");
        expect(table!.findColumnByName("text")!.type).toEqual("text");
        expect(table!.findColumnByName("nchar")!.type).toEqual("nchar");
        expect(table!.findColumnByName("nvarchar")!.type).toEqual("nvarchar");
        expect(table!.findColumnByName("ntext")!.type).toEqual("ntext");
        expect(table!.findColumnByName("binary")!.type).toEqual("binary");
        expect(table!.findColumnByName("varbinary")!.type).toEqual("varbinary");
        expect(table!.findColumnByName("image")!.type).toEqual("image");
        // the rowversion type's name in SQL server metadata is timestamp
        expect(table!.findColumnByName("rowversion")!.type).toEqual("timestamp");
        expect(table!.findColumnByName("date")!.type).toEqual("date");
        expect(table!.findColumnByName("dateObj")!.type).toEqual("date");
        expect(table!.findColumnByName("datetime")!.type).toEqual("datetime");
        expect(table!.findColumnByName("datetime2")!.type).toEqual("datetime2");
        expect(table!.findColumnByName("smalldatetime")!.type).toEqual("smalldatetime");
        expect(table!.findColumnByName("time")!.type).toEqual("time");
        expect(table!.findColumnByName("timeObj")!.type).toEqual("time");
        expect(table!.findColumnByName("datetimeoffset")!.type).toEqual("datetimeoffset");
        expect(table!.findColumnByName("geometry1")!.type).toEqual("geometry");
        expect(table!.findColumnByName("simpleArray")!.type).toEqual("ntext");
        expect(table!.findColumnByName("simpleJson")!.type).toEqual("ntext");
        expect(table!.findColumnByName("simpleEnum")!.type).toEqual("simple-enum");
        expect(table!.findColumnByName("simpleEnum")!.enum![0]).toEqual("A");
        expect(table!.findColumnByName("simpleEnum")!.enum![1]).toEqual("B");
        expect(table!.findColumnByName("simpleEnum")!.enum![2]).toEqual("C");
        expect(table!.findColumnByName("simpleClassEnum1")!.type).toEqual("simple-enum");
        expect(table!.findColumnByName("simpleClassEnum1")!.enum![0]).toEqual("apple");
        expect(table!.findColumnByName("simpleClassEnum1")!.enum![1]).toEqual("pineapple");
        expect(table!.findColumnByName("simpleClassEnum1")!.enum![2]).toEqual("banana");

    })));

    test("all types should work correctly - persist and hydrate when options are specified on columns", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(PostWithOptions);
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post_with_options");
        await queryRunner.release();

        const post = new PostWithOptions();
        post.id = 1;
        post.decimal = 50;
        post.dec = 60;
        post.numeric = 70;
        post.char = "AAA";
        post.varchar = "This is varchar";
        post.nchar = "AAA";
        post.nvarchar = "This is nvarchar";
        post.binary = new Buffer("AAAAA");
        post.varbinary = new Buffer("BBBBB");
        post.datetime2 = new Date();
        post.time = new Date();
        post.datetimeoffset = new Date();
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.char).toEqual(post.char);
        expect(loadedPost.varchar).toEqual(post.varchar);
        expect(loadedPost.nchar).toEqual(post.nchar);
        expect(loadedPost.nvarchar).toEqual(post.nvarchar);
        expect(loadedPost.decimal).toEqual(post.decimal);
        expect(loadedPost.dec).toEqual(post.dec);
        expect(loadedPost.numeric).toEqual(post.numeric);
        expect(loadedPost.char).toEqual(post.char);
        expect(loadedPost.varchar).toEqual(post.varchar);
        expect(loadedPost.nchar).toEqual(post.nchar);
        expect(loadedPost.nvarchar).toEqual(post.nvarchar);
        expect(loadedPost.binary.toString()).toEqual(post.binary.toString());
        expect(loadedPost.varbinary.toString()).toEqual(post.varbinary.toString());
        // commented because mssql inserted milliseconds are not always equal to what we say it to insert
        // commented to prevent CI failings
        // expect(loadedPost.datetime2.getTime()).toEqual(post.datetime2.getTime());
        // expect(loadedPost.datetimeoffset.getTime()).toEqual(post.datetimeoffset.getTime());
        expect(loadedPost.time).toEqual(DateUtils.mixedTimeToString(post.time));

        expect(table!.findColumnByName("id")!.type).toEqual("int");
        expect(table!.findColumnByName("decimal")!.type).toEqual("decimal");
        expect(table!.findColumnByName("decimal")!.precision!).toEqual(10);
        expect(table!.findColumnByName("decimal")!.scale!).toEqual(5);
        expect(table!.findColumnByName("dec")!.type).toEqual("decimal");
        expect(table!.findColumnByName("dec")!.precision!).toEqual(10);
        expect(table!.findColumnByName("dec")!.scale!).toEqual(5);
        expect(table!.findColumnByName("numeric")!.type).toEqual("numeric");
        expect(table!.findColumnByName("numeric")!.precision!).toEqual(10);
        expect(table!.findColumnByName("numeric")!.scale!).toEqual(5);
        expect(table!.findColumnByName("char")!.type).toEqual("char");
        expect(table!.findColumnByName("char")!.length!).toEqual("3");
        expect(table!.findColumnByName("varchar")!.type).toEqual("varchar");
        expect(table!.findColumnByName("varchar")!.length!).toEqual("50");
        expect(table!.findColumnByName("nchar")!.type).toEqual("nchar");
        expect(table!.findColumnByName("nchar")!.length!).toEqual("3");
        expect(table!.findColumnByName("nvarchar")!.type).toEqual("nvarchar");
        expect(table!.findColumnByName("nvarchar")!.length!).toEqual("40");
        expect(table!.findColumnByName("binary")!.type).toEqual("binary");
        expect(table!.findColumnByName("binary")!.length!).toEqual("5");
        expect(table!.findColumnByName("varbinary")!.type).toEqual("varbinary");
        expect(table!.findColumnByName("varbinary")!.length!).toEqual("5");
        expect(table!.findColumnByName("datetime2")!.type).toEqual("datetime2");
        expect(table!.findColumnByName("datetime2")!.precision!).toEqual(4);
        expect(table!.findColumnByName("time")!.type).toEqual("time");
        expect(table!.findColumnByName("time")!.precision!).toEqual(5);
        expect(table!.findColumnByName("datetimeoffset")!.type).toEqual("datetimeoffset");
        expect(table!.findColumnByName("datetimeoffset")!.precision!).toEqual(6);

    })));

    test("all types should work correctly - persist and hydrate when types are not specified on columns", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(PostWithoutTypes);
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post_without_types");
        await queryRunner.release();

        const post = new PostWithoutTypes();
        post.id = 1;
        post.name = "Post";
        post.bit = true;
        post.binary = new Buffer("A");
        post.datetime = new Date();
        post.datetime.setMilliseconds(0); // set milliseconds to zero because the SQL Server datetime type only has a 1/300 ms (~3.33̅ ms) resolution
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.name).toEqual(post.name);
        expect(loadedPost.bit).toEqual(post.bit);
        expect(loadedPost.binary.toString()).toEqual(post.binary.toString());
        expect(loadedPost.datetime.getTime()).toEqual(post.datetime.getTime());

        expect(table!.findColumnByName("id")!.type).toEqual("int");
        expect(table!.findColumnByName("name")!.type).toEqual("nvarchar");
        expect(table!.findColumnByName("bit")!.type).toEqual("bit");
        expect(table!.findColumnByName("binary")!.type).toEqual("binary");
        expect(table!.findColumnByName("datetime")!.type).toEqual("datetime");

    })));

});
