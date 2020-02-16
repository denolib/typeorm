import {join as joinPaths} from "../../../../vendor/https/deno.land/std/path/mod.ts";
import {Connection} from "../../../../src/index.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../../utils/test-utils.ts";
import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";

describe("indices > conditional index", function() {
    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["mssql", "postgres", "sqlite"], // only these drivers supports conditional indices
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly create conditional indices with WHERE condition", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");

        table!.indices.length.should.be.equal(2);
        expect(table!.indices[0].where).to.be.not.empty;
        expect(table!.indices[1].where).to.be.not.empty;

        await queryRunner.release();

    })));

    it("should correctly drop conditional indices and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        table!.indices.length.should.be.equal(2);
        expect(table!.indices[0].where).to.be.not.empty;
        expect(table!.indices[1].where).to.be.not.empty;

        await queryRunner.dropIndices(table!, table!.indices);

        table = await queryRunner.getTable("post");
        table!.indices.length.should.be.equal(0);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        table!.indices.length.should.be.equal(2);
        expect(table!.indices[0].where).to.be.not.empty;
        expect(table!.indices[1].where).to.be.not.empty;

        await queryRunner.release();

    })));

});

runIfMain(import.meta);
