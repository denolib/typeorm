import { runIfMain } from "../../../deps/mocha.ts";
import "../../../deps/chai.ts";
import { Connection } from "../../../../src/index.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../utils/test-utils.ts";
import { EnumArrayEntity, NumericEnum, StringEnum, HeterogeneousEnum, StringNumericEnum } from "./entity/EnumArrayEntity.ts";

describe("database schema > simple enum arrays", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [EnumArrayEntity],
            enabledDrivers: ["postgres"]
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly create default values", () => Promise.all(connections.map(async connection => {

        const enumEntityRepository = connection.getRepository(EnumArrayEntity);

        const enumEntity = new EnumArrayEntity();
        enumEntity.id = 1;
        await enumEntityRepository.save(enumEntity);

        const loadedEnumEntity = await enumEntityRepository.findOne(1);

        loadedEnumEntity!.numericEnums.should.be.eql([NumericEnum.GHOST, NumericEnum.ADMIN]);
        loadedEnumEntity!.stringEnums.should.be.eql([]);
        loadedEnumEntity!.stringNumericEnums.should.be.eql([StringNumericEnum.THREE, StringNumericEnum.ONE]);
        loadedEnumEntity!.heterogeneousEnums.should.be.eql([HeterogeneousEnum.YES]);
        loadedEnumEntity!.arrayDefinedStringEnums.should.be.eql(["admin"]);
        loadedEnumEntity!.arrayDefinedNumericEnums.should.be.eql([11, 13]);

    })));

    it("should correctly save and retrieve", () => Promise.all(connections.map(async connection => {

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

        loadedEnumEntity!.numericEnums.should.be.eql([NumericEnum.GHOST, NumericEnum.EDITOR]);
        loadedEnumEntity!.stringEnums.should.be.eql([StringEnum.MODERATOR]);
        loadedEnumEntity!.stringNumericEnums.should.be.eql([StringNumericEnum.FOUR]);
        loadedEnumEntity!.heterogeneousEnums.should.be.eql([HeterogeneousEnum.NO]);
        loadedEnumEntity!.arrayDefinedStringEnums.should.be.eql(["editor"]);
        loadedEnumEntity!.arrayDefinedNumericEnums.should.be.eql([12, 13]);

    })));

});

runIfMain(import.meta);
