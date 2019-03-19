import "reflect-metadata";
import { Connection } from "../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../utils/test-utils";
import { SimpleEnumEntity, NumericEnum, StringEnum, HeterogeneousEnum, StringNumericEnum } from "./entity/SimpleEnumEntity";

describe("database schema > simple-enums", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql", "mariadb", "postgres", "sqlite", "mssql"]
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly use default values", () => Promise.all(connections.map(async connection => {

        const enumEntityRepository = connection.getRepository(SimpleEnumEntity);

        const enumEntity = new SimpleEnumEntity();
        enumEntity.id = 1;
        enumEntity.enumWithoutdefault = StringEnum.EDITOR;
        await enumEntityRepository.save(enumEntity);

        const loadedEnumEntity = await enumEntityRepository.findOne(1);
        expect(loadedEnumEntity!.numericEnum).toEqual(NumericEnum.MODERATOR);
        expect(loadedEnumEntity!.stringEnum).toEqual(StringEnum.GHOST);
        expect(loadedEnumEntity!.stringNumericEnum).toEqual(StringNumericEnum.FOUR);
        expect(loadedEnumEntity!.heterogeneousEnum).toEqual(HeterogeneousEnum.NO);
        expect(loadedEnumEntity!.arrayDefinedStringEnum).toEqual("ghost");
        expect(loadedEnumEntity!.arrayDefinedNumericEnum).toEqual(12);

    })));

    test("should correctly save and retrieve", () => Promise.all(connections.map(async connection => {

        const enumEntityRepository = connection.getRepository(SimpleEnumEntity);

        const enumEntity = new SimpleEnumEntity();
        enumEntity.id = 1;
        enumEntity.numericEnum = NumericEnum.EDITOR;
        enumEntity.stringEnum = StringEnum.ADMIN;
        enumEntity.stringNumericEnum = StringNumericEnum.TWO;
        enumEntity.heterogeneousEnum = HeterogeneousEnum.YES;
        enumEntity.arrayDefinedStringEnum = "editor";
        enumEntity.arrayDefinedNumericEnum = 13;
        enumEntity.enumWithoutdefault = StringEnum.ADMIN;
        await enumEntityRepository.save(enumEntity);

        const loadedEnumEntity = await enumEntityRepository.findOne(1);
        expect(loadedEnumEntity!.numericEnum).toEqual(NumericEnum.EDITOR);
        expect(loadedEnumEntity!.stringEnum).toEqual(StringEnum.ADMIN);
        expect(loadedEnumEntity!.stringNumericEnum).toEqual(StringNumericEnum.TWO);
        expect(loadedEnumEntity!.heterogeneousEnum).toEqual(HeterogeneousEnum.YES);
        expect(loadedEnumEntity!.arrayDefinedStringEnum).toEqual("editor");
        expect(loadedEnumEntity!.arrayDefinedNumericEnum).toEqual(13);

    })));

});
