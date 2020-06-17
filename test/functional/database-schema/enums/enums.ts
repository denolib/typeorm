import { runIfMain } from "../../../deps/mocha.ts";
import "../../../deps/chai.ts";
import { Connection } from "../../../../src/index.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../utils/test-utils.ts";
import { EnumEntity, NumericEnum, StringEnum, HeterogeneousEnum, StringNumericEnum } from "./entity/EnumEntity.ts";

describe("database schema > enums", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [EnumEntity],
            enabledDrivers: ["postgres", "mysql"]
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly use default values", () => Promise.all(connections.map(async connection => {

        const enumEntityRepository = connection.getRepository(EnumEntity);

        const enumEntity = new EnumEntity();
        enumEntity.id = 1;
        enumEntity.enumWithoutdefault = StringEnum.EDITOR;
        await enumEntityRepository.save(enumEntity);

        const loadedEnumEntity = await enumEntityRepository.findOne(1);
        loadedEnumEntity!.numericEnum.should.be.eq(NumericEnum.MODERATOR);
        loadedEnumEntity!.stringEnum.should.be.eq(StringEnum.GHOST);
        loadedEnumEntity!.stringNumericEnum.should.be.eq(StringNumericEnum.FOUR);
        loadedEnumEntity!.heterogeneousEnum.should.be.eq(HeterogeneousEnum.NO);
        loadedEnumEntity!.arrayDefinedStringEnum.should.be.eq("ghost");
        loadedEnumEntity!.arrayDefinedNumericEnum.should.be.eq(12);

    })));


    it("should correctly save and retrieve", () => Promise.all(connections.map(async connection => {

        const enumEntityRepository = connection.getRepository(EnumEntity);

        const enumEntity = new EnumEntity();
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
        loadedEnumEntity!.numericEnum.should.be.eq(NumericEnum.EDITOR);
        loadedEnumEntity!.stringEnum.should.be.eq(StringEnum.ADMIN);
        loadedEnumEntity!.stringNumericEnum.should.be.eq(StringNumericEnum.TWO);
        loadedEnumEntity!.heterogeneousEnum.should.be.eq(HeterogeneousEnum.YES);
        loadedEnumEntity!.arrayDefinedStringEnum.should.be.eq("editor");
        loadedEnumEntity!.arrayDefinedNumericEnum.should.be.eq(13);

    })));

});

runIfMain(import.meta);
