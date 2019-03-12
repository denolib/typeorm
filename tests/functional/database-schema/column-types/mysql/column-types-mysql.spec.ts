import "reflect-metadata";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";
import {Post} from "./entity/Post";
import {Connection} from "../../../../../src";
import {PostWithOptions} from "./entity/PostWithOptions";
import {PostWithoutTypes} from "./entity/PostWithoutTypes";
import {FruitEnum} from "./enum/FruitEnum";

describe("database schema > column types > mysql", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql"],
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
        post.bit = Buffer.from([0]);
        post.int = 2147483647;
        post.integer = 2147483647;
        post.tinyint = 127;
        post.smallint = 32767;
        post.mediumint = 8388607;
        post.bigint = "8223372036854775807";
        post.float = 10.53;
        post.double = 10.1234;
        post.doublePrecision = 10.1234;
        post.real = 10.1234;
        post.dec = "822337";
        post.decimal = "822337";
        post.numeric = "822337";
        post.fixed = "822337";
        post.bool = true;
        post.boolean = false;
        post.char = "A";
        post.nChar = "A";
        post.nationalChar = "A";
        post.varchar = "This is varchar";
        post.nVarchar = "This is varchar";
        post.nationalVarchar = "This is varchar";
        post.text = "This is text";
        post.tinytext = "This is tinytext";
        post.mediumtext = "This is mediumtext";
        post.longtext = "This is longtext";
        post.date = "2017-06-21";
        post.datetime = new Date();
        post.datetime.setMilliseconds(0); // set milliseconds to zero, because if datetime type specified without precision, milliseconds won't save in database
        post.timestamp = new Date();
        post.timestamp.setMilliseconds(0); // set milliseconds to zero, because if datetime type specified without precision, milliseconds won't save in database
        post.time = "15:30:00";
        post.year = 2017;
        post.binary = new Buffer("A");
        post.varbinary = new Buffer("B");
        post.blob = new Buffer("This is blob");
        post.tinyblob = new Buffer("This is tinyblob");
        post.mediumblob = new Buffer("This is mediumblob");
        post.longblob = new Buffer("This is longblob");
        post.geometry = "POINT(1 1)";
        post.point = "POINT(1 1)";
        post.linestring = "LINESTRING(0 0,1 1,2 2)";
        post.polygon = "POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7,5 5))";
        post.multipoint = "MULTIPOINT((0 0),(20 20),(60 60))";
        post.multilinestring = "MULTILINESTRING((10 10,20 20),(15 15,30 15))";
        post.multipolygon = "MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)),((5 5,7 5,7 7,5 7,5 5)))";
        post.geometrycollection = "GEOMETRYCOLLECTION(POINT(10 10),POINT(30 30),LINESTRING(15 15,20 20))";
        post.enum = "A";
        post.classEnum1 = FruitEnum.Apple;
        post.json = { id: 1, name: "Post" };
        post.simpleArray = ["A", "B", "C"];
        post.simpleJson = { param: "VALUE" };
        post.simpleEnum = "A";
        post.simpleClassEnum1 = FruitEnum.Apple;
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.bit.toString()).toEqual(post.bit.toString());
        expect(loadedPost.int).toEqual(post.int);
        expect(loadedPost.tinyint).toEqual(post.tinyint);
        expect(loadedPost.smallint).toEqual(post.smallint);
        expect(loadedPost.mediumint).toEqual(post.mediumint);
        expect(loadedPost.bigint).toEqual(post.bigint);
        expect(loadedPost.float).toEqual(post.float);
        expect(loadedPost.double).toEqual(post.double);
        expect(loadedPost.doublePrecision).toEqual(post.doublePrecision);
        expect(loadedPost.real).toEqual(post.real);
        expect(loadedPost.dec).toEqual(post.dec);
        expect(loadedPost.decimal).toEqual(post.decimal);
        expect(loadedPost.numeric).toEqual(post.numeric);
        expect(loadedPost.fixed).toEqual(post.fixed);
        expect(loadedPost.bool).toEqual(post.bool);
        expect(loadedPost.boolean).toEqual(post.boolean);
        expect(loadedPost.char).toEqual(post.char);
        expect(loadedPost.nChar).toEqual(post.nChar);
        expect(loadedPost.nationalChar).toEqual(post.nationalChar);
        expect(loadedPost.varchar).toEqual(post.varchar);
        expect(loadedPost.nVarchar).toEqual(post.nVarchar);
        expect(loadedPost.nationalVarchar).toEqual(post.nationalVarchar);
        expect(loadedPost.text).toEqual(post.text);
        expect(loadedPost.tinytext).toEqual(post.tinytext);
        expect(loadedPost.mediumtext).toEqual(post.mediumtext);
        expect(loadedPost.longtext).toEqual(post.longtext);
        expect(loadedPost.date).toEqual(post.date);
        expect(loadedPost.datetime.getTime()).toEqual(post.datetime.getTime());
        expect(loadedPost.timestamp.getTime()).toEqual(post.timestamp.getTime());
        expect(loadedPost.time).toEqual(post.time);
        expect(loadedPost.year).toEqual(post.year);
        expect(loadedPost.binary.toString()).toEqual(post.binary.toString());
        expect(loadedPost.varbinary.toString()).toEqual(post.varbinary.toString());
        expect(loadedPost.blob.toString()).toEqual(post.blob.toString());
        expect(loadedPost.tinyblob.toString()).toEqual(post.tinyblob.toString());
        expect(loadedPost.mediumblob.toString()).toEqual(post.mediumblob.toString());
        expect(loadedPost.longblob.toString()).toEqual(post.longblob.toString());
        expect(loadedPost.geometry).toEqual(post.geometry);
        expect(loadedPost.point).toEqual(post.point);
        expect(loadedPost.linestring).toEqual(post.linestring);
        expect(loadedPost.polygon).toEqual(post.polygon);
        expect(loadedPost.multipoint).toEqual(post.multipoint);
        expect(loadedPost.multilinestring).toEqual(post.multilinestring);
        expect(loadedPost.multipolygon).toEqual(post.multipolygon);
        expect(loadedPost.geometrycollection).toEqual(post.geometrycollection);
        expect(loadedPost.enum).toEqual(post.enum);
        expect(loadedPost.classEnum1).toEqual(post.classEnum1);
        expect(loadedPost.json).toEqual(post.json);
        expect(loadedPost.simpleArray[0]).toEqual(post.simpleArray[0]);
        expect(loadedPost.simpleArray[1]).toEqual(post.simpleArray[1]);
        expect(loadedPost.simpleArray[2]).toEqual(post.simpleArray[2]);
        expect(loadedPost.simpleJson.param).toEqual(post.simpleJson.param);
        expect(loadedPost.simpleEnum).toEqual(post.simpleEnum);
        expect(loadedPost.simpleClassEnum1).toEqual(post.simpleClassEnum1);

        expect(table!.findColumnByName("id")!.type).toEqual("int");
        expect(table!.findColumnByName("bit")!.type).toEqual("bit");
        expect(table!.findColumnByName("int")!.type).toEqual("int");
        expect(table!.findColumnByName("integer")!.type).toEqual("int");
        expect(table!.findColumnByName("tinyint")!.type).toEqual("tinyint");
        expect(table!.findColumnByName("smallint")!.type).toEqual("smallint");
        expect(table!.findColumnByName("mediumint")!.type).toEqual("mediumint");
        expect(table!.findColumnByName("bigint")!.type).toEqual("bigint");
        expect(table!.findColumnByName("float")!.type).toEqual("float");
        expect(table!.findColumnByName("double")!.type).toEqual("double");
        expect(table!.findColumnByName("doublePrecision")!.type).toEqual("double");
        expect(table!.findColumnByName("real")!.type).toEqual("double");
        expect(table!.findColumnByName("dec")!.type).toEqual("decimal");
        expect(table!.findColumnByName("decimal")!.type).toEqual("decimal");
        expect(table!.findColumnByName("numeric")!.type).toEqual("decimal");
        expect(table!.findColumnByName("fixed")!.type).toEqual("decimal");
        expect(table!.findColumnByName("bool")!.type).toEqual("tinyint");
        expect(table!.findColumnByName("boolean")!.type).toEqual("tinyint");
        expect(table!.findColumnByName("char")!.type).toEqual("char");
        expect(table!.findColumnByName("nChar")!.type).toEqual("char");
        expect(table!.findColumnByName("nationalChar")!.type).toEqual("char");
        expect(table!.findColumnByName("varchar")!.type).toEqual("varchar");
        expect(table!.findColumnByName("nVarchar")!.type).toEqual("varchar");
        expect(table!.findColumnByName("nationalVarchar")!.type).toEqual("varchar");
        expect(table!.findColumnByName("text")!.type).toEqual("text");
        expect(table!.findColumnByName("tinytext")!.type).toEqual("tinytext");
        expect(table!.findColumnByName("mediumtext")!.type).toEqual("mediumtext");
        expect(table!.findColumnByName("longtext")!.type).toEqual("longtext");
        expect(table!.findColumnByName("date")!.type).toEqual("date");
        expect(table!.findColumnByName("datetime")!.type).toEqual("datetime");
        expect(table!.findColumnByName("timestamp")!.type).toEqual("timestamp");
        expect(table!.findColumnByName("time")!.type).toEqual("time");
        expect(table!.findColumnByName("year")!.type).toEqual("year");
        expect(table!.findColumnByName("binary")!.type).toEqual("binary");
        expect(table!.findColumnByName("varbinary")!.type).toEqual("varbinary");
        expect(table!.findColumnByName("blob")!.type).toEqual("blob");
        expect(table!.findColumnByName("tinyblob")!.type).toEqual("tinyblob");
        expect(table!.findColumnByName("mediumblob")!.type).toEqual("mediumblob");
        expect(table!.findColumnByName("longblob")!.type).toEqual("longblob");
        expect(table!.findColumnByName("geometry")!.type).toEqual("geometry");
        expect(table!.findColumnByName("point")!.type).toEqual("point");
        expect(table!.findColumnByName("linestring")!.type).toEqual("linestring");
        expect(table!.findColumnByName("polygon")!.type).toEqual("polygon");
        expect(table!.findColumnByName("multipoint")!.type).toEqual("multipoint");
        expect(table!.findColumnByName("multilinestring")!.type).toEqual("multilinestring");
        expect(table!.findColumnByName("multipolygon")!.type).toEqual("multipolygon");
        expect(table!.findColumnByName("geometrycollection")!.type).toEqual("geometrycollection");
        expect(table!.findColumnByName("enum")!.type).toEqual("enum");
        expect(table!.findColumnByName("enum")!.enum![0]).toEqual("A");
        expect(table!.findColumnByName("enum")!.enum![1]).toEqual("B");
        expect(table!.findColumnByName("enum")!.enum![2]).toEqual("C");
        expect(table!.findColumnByName("classEnum1")!.type).toEqual("enum");
        expect(table!.findColumnByName("classEnum1")!.enum![0]).toEqual("apple");
        expect(table!.findColumnByName("classEnum1")!.enum![1]).toEqual("pineapple");
        expect(table!.findColumnByName("classEnum1")!.enum![2]).toEqual("banana");
        expect(table!.findColumnByName("json")!.type).toEqual("json");
        expect(table!.findColumnByName("simpleArray")!.type).toEqual("text");
        expect(table!.findColumnByName("simpleJson")!.type).toEqual("text");
        expect(table!.findColumnByName("simpleEnum")!.type).toEqual("enum");
        expect(table!.findColumnByName("simpleEnum")!.enum![0]).toEqual("A");
        expect(table!.findColumnByName("simpleEnum")!.enum![1]).toEqual("B");
        expect(table!.findColumnByName("simpleEnum")!.enum![2]).toEqual("C");
        expect(table!.findColumnByName("simpleClassEnum1")!.type).toEqual("enum");
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
        post.name = "Post";
        post.float = 10.53;
        post.double = 10.12;
        post.decimal = "12345.00";
        post.char = "A";
        post.varchar = "This is varchar";
        post.datetime = new Date();
        post.timestamp = new Date();
        post.time = "15:30:00.256";
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.name).toEqual(post.name);
        expect(loadedPost.float).toEqual(post.float);
        expect(loadedPost.double).toEqual(post.double);
        expect(loadedPost.decimal).toEqual(post.decimal);
        expect(loadedPost.char).toEqual(post.char);
        expect(loadedPost.varchar).toEqual(post.varchar);
        expect(loadedPost.datetime.getTime()).toEqual(post.datetime.getTime());
        expect(loadedPost.timestamp.getTime()).toEqual(post.timestamp.getTime());
        expect(loadedPost.time).toEqual(post.time);

        expect(table!.findColumnByName("id")!.type).toEqual("int");
        expect(table!.findColumnByName("name")!.type).toEqual("varchar");
        expect(table!.findColumnByName("name")!.length!).toEqual("10");
        expect(table!.findColumnByName("float")!.type).toEqual("float");
        expect(table!.findColumnByName("float")!.precision!).toEqual(5);
        expect(table!.findColumnByName("float")!.scale!).toEqual(2);
        expect(table!.findColumnByName("double")!.type).toEqual("double");
        expect(table!.findColumnByName("double")!.precision!).toEqual(5);
        expect(table!.findColumnByName("double")!.scale!).toEqual(2);
        expect(table!.findColumnByName("decimal")!.type).toEqual("decimal");
        expect(table!.findColumnByName("decimal")!.precision!).toEqual(7);
        expect(table!.findColumnByName("decimal")!.scale!).toEqual(2);
        expect(table!.findColumnByName("char")!.type).toEqual("char");
        expect(table!.findColumnByName("char")!.length!).toEqual("5");
        expect(table!.findColumnByName("varchar")!.type).toEqual("varchar");
        expect(table!.findColumnByName("varchar")!.length!).toEqual("30");
        expect(table!.findColumnByName("datetime")!.type).toEqual("datetime");
        expect(table!.findColumnByName("datetime")!.precision!).toEqual(6);
        expect(table!.findColumnByName("timestamp")!.type).toEqual("timestamp");
        expect(table!.findColumnByName("timestamp")!.precision!).toEqual(6);
        expect(table!.findColumnByName("time")!.type).toEqual("time");
        expect(table!.findColumnByName("time")!.precision!).toEqual(3);

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
        post.blob = new Buffer("A");
        post.datetime = new Date();
        post.datetime.setMilliseconds(0); // set milliseconds to zero, because if datetime type specified without precision, milliseconds won't save in database
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.name).toEqual(post.name);
        expect(loadedPost.boolean).toEqual(post.boolean);
        expect(loadedPost.blob.toString()).toEqual(post.blob.toString());
        expect(loadedPost.datetime.getTime()).toEqual(post.datetime.getTime());

        expect(table!.findColumnByName("id")!.type).toEqual("int");
        expect(table!.findColumnByName("name")!.type).toEqual("varchar");
        expect(table!.findColumnByName("boolean")!.type).toEqual("tinyint");
        expect(table!.findColumnByName("blob")!.type).toEqual("blob");
        expect(table!.findColumnByName("datetime")!.type).toEqual("datetime");

    })));

});
