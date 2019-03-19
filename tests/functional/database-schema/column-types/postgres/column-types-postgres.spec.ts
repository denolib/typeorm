import "reflect-metadata";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../utils/test-utils";
import {PostWithOptions} from "./entity/PostWithOptions";
import {Connection} from "../../../../../src";
import {PostWithoutTypes} from "./entity/PostWithoutTypes";
import {Post} from "./entity/Post";

describe("database schema > column types > postgres", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["postgres"],
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
        post.integer = 2147483647;
        post.int4 = 2147483647;
        post.int = 2147483647;
        post.smallint = 32767;
        post.int2 = 32767;
        post.bigint = "8223372036854775807";
        post.int8 = "8223372036854775807";
        post.numeric = "50";
        post.decimal = "50";
        post.doublePrecision = 15.357;
        post.float8 = 15.357;
        post.real = 5.5;
        post.float4 = 5.5;
        post.money = "$775,807.07";
        post.char = "A";
        post.character = "A";
        post.varchar = "This is varchar";
        post.characterVarying = "This is character varying";
        post.text = "This is text";
        post.citext = "This is text";
        post.hstore = "name => Alice, surname => A, age => 30";
        post.bytea = Buffer.alloc(13, "This is bytes");
        post.date = "2017-06-21";
        post.interval = "1 year 2 months 3 days 4 hours 5 minutes 6 seconds";
        post.time = "15:30:00";
        post.timeWithTimeZone = "15:30:00 PST";
        post.timetz = "15:30:00 PST";
        post.timestamp = new Date();
        post.timestamp.setMilliseconds(0);
        post.timestampWithTimeZone = new Date();
        post.timestampWithTimeZone.setMilliseconds(0);
        post.timestamptz = new Date();
        post.timestamptz.setMilliseconds(0);
        post.boolean = true;
        post.bool = false;
        post.enum = "A";
        post.point = "(10,20)";
        post.line = "{1,2,3}";
        post.lseg = "(1,2), (3,4)";
        post.box = "(1,2),(3,4)"; // postgres swaps coordinates in database. This one will be saved like (3,4),(1,2)
        post.path = "((3,1),(2,8),(10,4))";
        post.polygon = "((3,1),(2,8),(10,4))";
        post.circle = "4, 5, 12";
        post.cidr = "192.168.100.128/25";
        post.inet = "192.168.100.128";
        post.macaddr = "08:00:2b:01:02:03";
        post.bit = "1";
        post.varbit = "100";
        post.bitVarying = "00";
        post.uuid = "0e37df36-f698-11e6-8dd4-cb9ced3df976";
        post.json = { id: 1, name: "Post" };
        post.jsonb = { id: 1, name: "Post" };
        post.int4range = "[10,20)";
        post.int8range = "[200000,500000)";
        post.numrange = "(10.5,20.2)";
        post.tsrange = "[2010-01-01 14:30,2010-01-01 15:30)";
        post.tstzrange = "[2010-01-01 14:30:00+00,2010-01-01 15:30:00+00)";
        post.daterange = "[2010-01-01,2010-01-05)";
        post.xml = "<book><title>Manual</title><chapter>...</chapter></book>";
        post.array = [1, 2, 3];
        post.simpleArray = ["A", "B", "C"];
        post.simpleJson = { param: "VALUE" };
        post.simpleEnum = "A";
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
        expect(loadedPost.numeric).toEqual(post.numeric);
        expect(loadedPost.decimal).toEqual(post.decimal);
        expect(loadedPost.doublePrecision).toEqual(post.doublePrecision);
        expect(loadedPost.float8).toEqual(post.float8);
        expect(loadedPost.real).toEqual(post.real);
        expect(loadedPost.float4).toEqual(post.float4);
        expect(loadedPost.money).toEqual(post.money);
        expect(loadedPost.char).toEqual(post.char);
        expect(loadedPost.character).toEqual(post.character);
        expect(loadedPost.varchar).toEqual(post.varchar);
        expect(loadedPost.characterVarying).toEqual(post.characterVarying);
        expect(loadedPost.text).toEqual(post.text);
        expect(loadedPost.citext).toEqual("This is text");
        expect(loadedPost.hstore).toEqual(`"age"=>"30", "name"=>"Alice", "surname"=>"A"`);
        expect(loadedPost.bytea.toString()).toEqual(post.bytea.toString());
        expect(loadedPost.date).toEqual(post.date);
        expect(loadedPost.interval.years).toEqual(1);
        expect(loadedPost.interval.months).toEqual(2);
        expect(loadedPost.interval.days).toEqual(3);
        expect(loadedPost.interval.hours).toEqual(4);
        expect(loadedPost.interval.minutes).toEqual(5);
        expect(loadedPost.interval.seconds).toEqual(6);
        expect(loadedPost.time).toEqual(post.time);
        expect(loadedPost.timeWithTimeZone).toEqual("15:30:00-08");
        expect(loadedPost.timetz).toEqual("15:30:00-08");
        expect(loadedPost.timestamp.valueOf()).toEqual(post.timestamp.valueOf());
        // expect(loadedPost.timestampWithTimeZone.getTime()).toEqual(post.timestampWithTimeZone.getTime());
        expect(loadedPost.timestamptz.valueOf()).toEqual(post.timestamptz.valueOf());
        expect(loadedPost.boolean).toEqual(post.boolean);
        expect(loadedPost.bool).toEqual(post.bool);
        expect(loadedPost.enum).toEqual(post.enum);
        expect(loadedPost.point).toEqual({ x: 10, y: 20 });
        expect(loadedPost.line).toEqual(post.line);
        expect(loadedPost.lseg).toEqual("[(1,2),(3,4)]");
        // expect(loadedPost.box).toEqual(post.box); // postgres swaps coordinates in database. This one will be saved like (3,4),(1,2)
        expect(loadedPost.path).toEqual(post.path);
        expect(loadedPost.polygon).toEqual(post.polygon);
        expect(loadedPost.circle).toEqual({ x: 4, y: 5, radius: 12 });
        expect(loadedPost.cidr).toEqual(post.cidr);
        expect(loadedPost.inet).toEqual(post.inet);
        expect(loadedPost.macaddr).toEqual(post.macaddr);
        expect(loadedPost.bit).toEqual(post.bit);
        expect(loadedPost.varbit).toEqual(post.varbit);
        expect(loadedPost.bitVarying).toEqual(post.bitVarying);
        expect(loadedPost.uuid).toEqual(post.uuid);
        expect(loadedPost.json).toEqual(post.json);
        expect(loadedPost.jsonb).toEqual(post.jsonb);
        expect(loadedPost.int4range).toEqual(post.int4range);
        expect(loadedPost.int8range).toEqual(post.int8range);
        expect(loadedPost.numrange).toEqual(post.numrange);
        expect(loadedPost.tsrange).toEqual(`["2010-01-01 14:30:00","2010-01-01 15:30:00")`);
        expect(loadedPost.tstzrange).toEqual(`["2010-01-01 14:30:00+00","2010-01-01 15:30:00+00")`);
        expect(loadedPost.daterange).toEqual(post.daterange);
        expect(loadedPost.xml).toEqual(post.xml);
        expect(loadedPost.array[0]).toEqual(post.array[0]);
        expect(loadedPost.array[1]).toEqual(post.array[1]);
        expect(loadedPost.array[2]).toEqual(post.array[2]);
        expect(loadedPost.simpleArray[0]).toEqual(post.simpleArray[0]);
        expect(loadedPost.simpleArray[1]).toEqual(post.simpleArray[1]);
        expect(loadedPost.simpleArray[2]).toEqual(post.simpleArray[2]);
        expect(loadedPost.simpleJson.param).toEqual(post.simpleJson.param);
        expect(loadedPost.simpleEnum).toEqual(post.simpleEnum);

        expect(table!.findColumnByName("id")!.type).toEqual("integer");
        expect(table!.findColumnByName("name")!.type).toEqual("character varying");
        expect(table!.findColumnByName("integer")!.type).toEqual("integer");
        expect(table!.findColumnByName("int4")!.type).toEqual("integer");
        expect(table!.findColumnByName("int")!.type).toEqual("integer");
        expect(table!.findColumnByName("smallint")!.type).toEqual("smallint");
        expect(table!.findColumnByName("int2")!.type).toEqual("smallint");
        expect(table!.findColumnByName("bigint")!.type).toEqual("bigint");
        expect(table!.findColumnByName("numeric")!.type).toEqual("numeric");
        expect(table!.findColumnByName("decimal")!.type).toEqual("numeric");
        expect(table!.findColumnByName("doublePrecision")!.type).toEqual("double precision");
        expect(table!.findColumnByName("float8")!.type).toEqual("double precision");
        expect(table!.findColumnByName("real")!.type).toEqual("real");
        expect(table!.findColumnByName("float4")!.type).toEqual("real");
        expect(table!.findColumnByName("money")!.type).toEqual("money");
        expect(table!.findColumnByName("char")!.type).toEqual("character");
        expect(table!.findColumnByName("character")!.type).toEqual("character");
        expect(table!.findColumnByName("varchar")!.type).toEqual("character varying");
        expect(table!.findColumnByName("characterVarying")!.type).toEqual("character varying");
        expect(table!.findColumnByName("text")!.type).toEqual("text");
        expect(table!.findColumnByName("citext")!.type).toEqual("citext");
        expect(table!.findColumnByName("hstore")!.type).toEqual("hstore");
        expect(table!.findColumnByName("bytea")!.type).toEqual("bytea");
        expect(table!.findColumnByName("date")!.type).toEqual("date");
        expect(table!.findColumnByName("interval")!.type).toEqual("interval");
        expect(table!.findColumnByName("time")!.type).toEqual("time without time zone");
        expect(table!.findColumnByName("timeWithTimeZone")!.type).toEqual("time with time zone");
        expect(table!.findColumnByName("timetz")!.type).toEqual("time with time zone");
        expect(table!.findColumnByName("timestamp")!.type).toEqual("timestamp without time zone");
        expect(table!.findColumnByName("timestampWithTimeZone")!.type).toEqual("timestamp with time zone");
        expect(table!.findColumnByName("timestamptz")!.type).toEqual("timestamp with time zone");
        expect(table!.findColumnByName("boolean")!.type).toEqual("boolean");
        expect(table!.findColumnByName("bool")!.type).toEqual("boolean");
        expect(table!.findColumnByName("enum")!.type).toEqual("enum");
        expect(table!.findColumnByName("point")!.type).toEqual("point");
        expect(table!.findColumnByName("line")!.type).toEqual("line");
        expect(table!.findColumnByName("lseg")!.type).toEqual("lseg");
        expect(table!.findColumnByName("box")!.type).toEqual("box");
        expect(table!.findColumnByName("path")!.type).toEqual("path");
        expect(table!.findColumnByName("polygon")!.type).toEqual("polygon");
        expect(table!.findColumnByName("circle")!.type).toEqual("circle");
        expect(table!.findColumnByName("cidr")!.type).toEqual("cidr");
        expect(table!.findColumnByName("inet")!.type).toEqual("inet");
        expect(table!.findColumnByName("macaddr")!.type).toEqual("macaddr");
        expect(table!.findColumnByName("bit")!.type).toEqual("bit");
        expect(table!.findColumnByName("varbit")!.type).toEqual("bit varying");
        expect(table!.findColumnByName("bitVarying")!.type).toEqual("bit varying");
        expect(table!.findColumnByName("uuid")!.type).toEqual("uuid");
        expect(table!.findColumnByName("xml")!.type).toEqual("xml");
        expect(table!.findColumnByName("json")!.type).toEqual("json");
        expect(table!.findColumnByName("jsonb")!.type).toEqual("jsonb");
        expect(table!.findColumnByName("int4range")!.type).toEqual("int4range");
        expect(table!.findColumnByName("int8range")!.type).toEqual("int8range");
        expect(table!.findColumnByName("numrange")!.type).toEqual("numrange");
        expect(table!.findColumnByName("tsrange")!.type).toEqual("tsrange");
        expect(table!.findColumnByName("tstzrange")!.type).toEqual("tstzrange");
        expect(table!.findColumnByName("daterange")!.type).toEqual("daterange");
        expect(table!.findColumnByName("array")!.type).toEqual("integer");
        expect(table!.findColumnByName("array")!.isArray!).toBeTruthy();
        expect(table!.findColumnByName("simpleArray")!.type).toEqual("text");
        expect(table!.findColumnByName("simpleJson")!.type).toEqual("text");
        expect(table!.findColumnByName("simpleEnum")!.type).toEqual("enum");

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
        post.char = "AAA";
        post.character = "AAA";
        post.varchar = "This is varchar";
        post.characterVarying = "This is character varying";
        post.timestamp = new Date();
        post.timestampWithTimeZone = new Date();
        post.time = "15:30:13.278";
        post.timeWithTimeZone = "15:30:13.27801+05";
        post.int4range = "[2,4)";
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.numeric).toEqual(post.numeric);
        expect(loadedPost.decimal).toEqual(post.decimal);
        expect(loadedPost.char).toEqual(post.char);
        expect(loadedPost.character).toEqual(post.character);
        expect(loadedPost.varchar).toEqual(post.varchar);
        expect(loadedPost.characterVarying).toEqual(post.characterVarying);
        expect(loadedPost.timestamp.valueOf()).toEqual(post.timestamp.valueOf());
        // expect(loadedPost.timestampWithTimeZone.valueOf()).toEqual(post.timestampWithTimeZone.valueOf());
        expect(loadedPost.time.valueOf()).toEqual(post.time.valueOf());
        expect(loadedPost.timeWithTimeZone.valueOf()).toEqual(post.timeWithTimeZone.valueOf());
        expect(loadedPost.int4range.valueOf()).toEqual(post.int4range.valueOf());

        expect(table!.findColumnByName("id")!.type).toEqual("integer");
        expect(table!.findColumnByName("numeric")!.type).toEqual("numeric");
        expect(table!.findColumnByName("numeric")!.precision!).toEqual(5);
        expect(table!.findColumnByName("numeric")!.scale!).toEqual(2);
        expect(table!.findColumnByName("decimal")!.type).toEqual("numeric");
        expect(table!.findColumnByName("decimal")!.precision!).toEqual(5);
        expect(table!.findColumnByName("decimal")!.scale!).toEqual(2);
        expect(table!.findColumnByName("char")!.type).toEqual("character");
        expect(table!.findColumnByName("char")!.length!).toEqual("3");
        expect(table!.findColumnByName("character")!.type).toEqual("character");
        expect(table!.findColumnByName("character")!.length!).toEqual("3");
        expect(table!.findColumnByName("varchar")!.type).toEqual("character varying");
        expect(table!.findColumnByName("varchar")!.length!).toEqual("30");
        expect(table!.findColumnByName("characterVarying")!.type).toEqual("character varying");
        expect(table!.findColumnByName("characterVarying")!.length!).toEqual("30");
        expect(table!.findColumnByName("timestamp")!.type).toEqual("timestamp without time zone");
        expect(table!.findColumnByName("timestamp")!.precision!).toEqual(3);
        expect(table!.findColumnByName("timestampWithTimeZone")!.type).toEqual("timestamp with time zone");
        expect(table!.findColumnByName("timestampWithTimeZone")!.precision!).toEqual(5);
        expect(table!.findColumnByName("time")!.type).toEqual("time without time zone");
        expect(table!.findColumnByName("time")!.precision!).toEqual(3);
        expect(table!.findColumnByName("timeWithTimeZone")!.type).toEqual("time with time zone");
        expect(table!.findColumnByName("timeWithTimeZone")!.precision!).toEqual(5);
        expect(table!.findColumnByName("int4range")!.type).toEqual("int4range");
        expect(table!.findColumnByName("int4range")!.isNullable!).toEqual(true);

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
        post.datetime = new Date();
        post.datetime.setMilliseconds(0);
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.name).toEqual(post.name);
        expect(loadedPost.bit).toEqual(post.bit);
        expect(loadedPost.datetime.valueOf()).toEqual(post.datetime.valueOf());

        expect(table!.findColumnByName("id")!.type).toEqual("integer");
        expect(table!.findColumnByName("name")!.type).toEqual("character varying");
        expect(table!.findColumnByName("bit")!.type).toEqual("boolean");
        expect(table!.findColumnByName("datetime")!.type).toEqual("timestamp without time zone");

    })));

});
