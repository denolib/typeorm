import "reflect-metadata";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";
import {Post} from "./entity/Post";
import {Connection} from "../../../../../src";
import {PostWithoutTypes} from "./entity/PostWithoutTypes";
import {FruitEnum} from "./enum/FruitEnum";

describe("database schema > column types > sqlite", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["sqlite"],
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
        post.int = 2147483647;
        post.int2 = 32767;
        post.int8 = 8223372036854775807;
        post.tinyint = 127;
        post.smallint = 32767;
        post.mediumint = 8388607;
        post.bigint = 8223372036854775807;
        post.unsignedBigInt = 8223372036854775807;
        post.character = "A";
        post.varchar = "This is varchar";
        post.varyingCharacter = "This is varying character";
        post.nchar = "This is nchar";
        post.nativeCharacter = "This is native character";
        post.nvarchar = "This is nvarchar";
        post.blob = new Buffer("This is blob");
        post.clob = "This is clob";
        post.text = "This is text";
        post.real = 10.5;
        post.double = 10.1234;
        post.doublePrecision = 10.1234;
        post.float = 10.53;
        post.numeric = 10;
        post.decimal = 50;
        post.boolean = true;
        post.date = "2017-06-21";
        post.datetime = new Date();
        post.datetime.setMilliseconds(0);
        post.simpleArray = ["A", "B", "C"];
        post.simpleJson = { param: "VALUE" };
        post.simpleEnum = "A";
        post.simpleClassEnum1 = FruitEnum.Apple;
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.name).toEqual(post.name);
        expect(loadedPost.int).toEqual(post.int);
        expect(loadedPost.int2).toEqual(post.int2);
        expect(loadedPost.int8).toEqual(post.int8);
        expect(loadedPost.tinyint).toEqual(post.tinyint);
        expect(loadedPost.smallint).toEqual(post.smallint);
        expect(loadedPost.mediumint).toEqual(post.mediumint);
        expect(loadedPost.bigint).toEqual(post.bigint);
        expect(loadedPost.unsignedBigInt).toEqual(post.unsignedBigInt);
        expect(loadedPost.character).toEqual(post.character);
        expect(loadedPost.varchar).toEqual(post.varchar);
        expect(loadedPost.varyingCharacter).toEqual(post.varyingCharacter);
        expect(loadedPost.nchar).toEqual(post.nchar);
        expect(loadedPost.nativeCharacter).toEqual(post.nativeCharacter);
        expect(loadedPost.nvarchar).toEqual(post.nvarchar);
        expect(loadedPost.text).toEqual(post.text);
        expect(loadedPost.blob.toString()).toEqual(post.blob.toString());
        expect(loadedPost.clob).toEqual(post.clob);
        expect(loadedPost.real).toEqual(post.real);
        expect(loadedPost.double).toEqual(post.double);
        expect(loadedPost.doublePrecision).toEqual(post.doublePrecision);
        expect(loadedPost.float).toEqual(post.float);
        expect(loadedPost.numeric).toEqual(post.numeric);
        expect(loadedPost.decimal).toEqual(post.decimal);
        expect(loadedPost.date).toEqual(post.date);
        expect(loadedPost.boolean).toEqual(post.boolean);
        expect(loadedPost.date).toEqual(post.date);
        expect(loadedPost.datetime.valueOf()).toEqual(post.datetime.valueOf());
        expect(loadedPost.simpleArray[0]).toEqual(post.simpleArray[0]);
        expect(loadedPost.simpleArray[1]).toEqual(post.simpleArray[1]);
        expect(loadedPost.simpleArray[2]).toEqual(post.simpleArray[2]);
        expect(loadedPost.simpleJson.param).toEqual(post.simpleJson.param);
        expect(loadedPost.simpleEnum).toEqual(post.simpleEnum);
        expect(loadedPost.simpleClassEnum1).toEqual(post.simpleClassEnum1);

        expect(table!.findColumnByName("id")!.type).toEqual("integer");
        expect(table!.findColumnByName("name")!.type).toEqual("varchar");
        expect(table!.findColumnByName("int")!.type).toEqual("integer");
        expect(table!.findColumnByName("int2")!.type).toEqual("int2");
        expect(table!.findColumnByName("int8")!.type).toEqual("int8");
        expect(table!.findColumnByName("tinyint")!.type).toEqual("tinyint");
        expect(table!.findColumnByName("smallint")!.type).toEqual("smallint");
        expect(table!.findColumnByName("mediumint")!.type).toEqual("mediumint");
        expect(table!.findColumnByName("bigint")!.type).toEqual("bigint");
        expect(table!.findColumnByName("unsignedBigInt")!.type).toEqual("unsigned big int");
        expect(table!.findColumnByName("character")!.type).toEqual("character");
        expect(table!.findColumnByName("varchar")!.type).toEqual("varchar");
        expect(table!.findColumnByName("varyingCharacter")!.type).toEqual("varying character");
        expect(table!.findColumnByName("nchar")!.type).toEqual("nchar");
        expect(table!.findColumnByName("nativeCharacter")!.type).toEqual("native character");
        expect(table!.findColumnByName("nvarchar")!.type).toEqual("nvarchar");
        expect(table!.findColumnByName("text")!.type).toEqual("text");
        expect(table!.findColumnByName("blob")!.type).toEqual("blob");
        expect(table!.findColumnByName("clob")!.type).toEqual("clob");
        expect(table!.findColumnByName("real")!.type).toEqual("real");
        expect(table!.findColumnByName("double")!.type).toEqual("double");
        expect(table!.findColumnByName("doublePrecision")!.type).toEqual("double precision");
        expect(table!.findColumnByName("float")!.type).toEqual("float");
        expect(table!.findColumnByName("numeric")!.type).toEqual("numeric");
        expect(table!.findColumnByName("decimal")!.type).toEqual("decimal");
        expect(table!.findColumnByName("boolean")!.type).toEqual("boolean");
        expect(table!.findColumnByName("date")!.type).toEqual("date");
        expect(table!.findColumnByName("datetime")!.type).toEqual("datetime");
        expect(table!.findColumnByName("simpleArray")!.type).toEqual("text");
        expect(table!.findColumnByName("simpleJson")!.type).toEqual("text");
        expect(table!.findColumnByName("simpleEnum")!.type).toEqual("simple-enum");
        expect(table!.findColumnByName("simpleEnum")!.enum![0]).toEqual("A");
        expect(table!.findColumnByName("simpleEnum")!.enum![1]).toEqual("B");
        expect(table!.findColumnByName("simpleEnum")!.enum![2]).toEqual("C");
        expect(table!.findColumnByName("simpleClassEnum1")!.type).toEqual("simple-enum");
        expect(table!.findColumnByName("simpleClassEnum1")!.enum![0]).toEqual("apple");
        expect(table!.findColumnByName("simpleClassEnum1")!.enum![1]).toEqual("pineapple");
        expect(table!.findColumnByName("simpleClassEnum1")!.enum![2]).toEqual("banana");

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
        post.datetime.setMilliseconds(0);
        await postRepository.save(post);

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(post.id);
        expect(loadedPost.name).toEqual(post.name);
        expect(loadedPost.boolean).toEqual(post.boolean);
        expect(loadedPost.blob.toString()).toEqual(post.blob.toString());
        expect(loadedPost.datetime.valueOf()).toEqual(post.datetime.valueOf());

        expect(table!.findColumnByName("id")!.type).toEqual("integer");
        expect(table!.findColumnByName("name")!.type).toEqual("varchar");
        expect(table!.findColumnByName("boolean")!.type).toEqual("boolean");
        expect(table!.findColumnByName("blob")!.type).toEqual("blob");
        expect(table!.findColumnByName("datetime")!.type).toEqual("datetime");

    })));

});
