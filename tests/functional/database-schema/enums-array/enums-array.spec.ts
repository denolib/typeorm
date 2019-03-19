import "reflect-metadata";
import { Connection } from "../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../utils/test-utils";
import { EnumArrayEntity, NumericEnum, StringEnum, HeterogeneousEnum, StringNumericEnum } from "./entity/EnumArrayEntity";

describe("database schema > enum arrays", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["postgres"]
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create default values", () => Promise.all(connections.map(async connection => {

        const enumEntityRepository = connection.getRepository(EnumArrayEntity);

        const enumEntity = new EnumArrayEntity();
        enumEntity.id = 1;
        await enumEntityRepository.save(enumEntity);

        const loadedEnumEntity = await enumEntityRepository.findOne(1);

        expect(loadedEnumEntity!.numericEnums).toEqual([NumericEnum.GHOST, NumericEnum.ADMIN]);
        expect(loadedEnumEntity!.stringEnums).toEqual([]);
        expect(loadedEnumEntity!.stringNumericEnums).toEqual([StringNumericEnum.THREE, StringNumericEnum.ONE]);
        expect(loadedEnumEntity!.heterogeneousEnums).toEqual([HeterogeneousEnum.YES]);
        expect(loadedEnumEntity!.arrayDefinedStringEnums).toEqual(["admin"]);
        expect(loadedEnumEntity!.arrayDefinedNumericEnums).toEqual([11, 13]);

    })));

    test("should correctly save and retrieve", () => Promise.all(connections.map(async connection => {

        const enumEntityRepository = connection.getRepository(EnumArrayEntity);

        const enumEntity = new EnumArrayEntity();
        enumEntity.id = 1;
        enumEntity.numericEnums = [NumericEnum.GHOST, NumericEnum.EDITOR];
        enumEntity.stringEnums = [StringEnum.MODERATOR];
        enumEntity.stringNumericEnums = [StringNumericEnum.FOUR];
        enumEntity.heterogeneousEnums = [HeterogeneousEnum.NO];
        enumEntity.arrayDefinedStringEnums = ["editor"];
        enumEntity.arrayDefinedNumericEnums = [12, 13];
        await enumEntityRepository.save(enumEntity);

        const loadedEnumEntity = await enumEntityRepository.findOne(1);

        expect(loadedEnumEntity!.numericEnums).toEqual([NumericEnum.GHOST, NumericEnum.EDITOR]);
        expect(loadedEnumEntity!.stringEnums).toEqual([StringEnum.MODERATOR]);
        expect(loadedEnumEntity!.stringNumericEnums).toEqual([StringNumericEnum.FOUR]);
        expect(loadedEnumEntity!.heterogeneousEnums).toEqual([HeterogeneousEnum.NO]);
        expect(loadedEnumEntity!.arrayDefinedStringEnums).toEqual(["editor"]);
        expect(loadedEnumEntity!.arrayDefinedNumericEnums).toEqual([12, 13]);

    })));

});
