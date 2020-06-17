import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {LetterBox} from "./entity/LetterBox.ts";

// Another related path: test/functional/spatial
describe("github issues > #3702 MySQL Spatial Type Support : GeomFromText function is not supported", () => {

    describe("when legacySpatialSupport: true", () => {
        let connections: Connection[];

        before(async () => connections = await createTestingConnections({
            entities: [LetterBox],
            enabledDrivers: ["mysql"],
            dropSchema: true,
            schemaCreate: true,
            driverSpecific: {
                // it's default
                // legacySpatialSupport: true,
            },
        }));
        after(() => closeTestingConnections(connections));

        it("should use GeomFromText", () => Promise.all(connections.map(async connection => {
            let queryBuilder = connection.createQueryBuilder().insert();
            queryBuilder.into(LetterBox).values({ coord: "POINT(20 30)" });
            const sql = queryBuilder.getSql();

            expect(sql).includes("GeomFromText");
            expect(sql).not.includes("ST_GeomFromText");

            await queryBuilder.execute();
        })));


        it("should provide SRID", () => Promise.all(connections.map(async connection => {
            let queryBuilder = connection.createQueryBuilder().insert();
            queryBuilder.into(LetterBox).values({ coord: "POINT(25 100)" });
            const sql = queryBuilder.getSql();

            expect(sql).includes("4326");

            await queryBuilder.execute();
        })));

        it("should use AsText", () => Promise.all(connections.map(async connection => {
            const repository = connection.getRepository(LetterBox);
            let queryBuilder = repository.createQueryBuilder("letterBox").select(["letterBox"]);
            const sql = queryBuilder.getSql();

            expect(sql).includes("AsText");
            expect(sql).not.includes("ST_AsText");

            await queryBuilder.getMany();
        })));
    });


    describe("when legacySpatialSupport: false", () => {
        let connections: Connection[];

        before(async () => connections = await createTestingConnections({
            entities: [LetterBox],
            enabledDrivers: ["mysql"],
            dropSchema: true,
            schemaCreate: true,
            driverSpecific: {
                legacySpatialSupport: false,
            }
        }));
        after(() => closeTestingConnections(connections));

        it("should use ST_GeomFromText", () => Promise.all(connections.map(async connection => {
            let queryBuilder = connection.createQueryBuilder().insert();
            queryBuilder.into(LetterBox).values({ coord: "POINT(20 30)" });
            const sql = queryBuilder.getSql();

            expect(sql).includes("ST_GeomFromText");

            await queryBuilder.execute();
        })));

        it("should provide SRID", () => Promise.all(connections.map(async connection => {
            let queryBuilder = connection.createQueryBuilder().insert();
            queryBuilder.into(LetterBox).values({ coord: "POINT(25 100)" });
            const sql = queryBuilder.getSql();

            expect(sql).includes("4326");

            await queryBuilder.execute();
        })));

        it("should use ST_AsText", () => Promise.all(connections.map(async connection => {
            const repository = connection.getRepository(LetterBox);
            let queryBuilder = repository.createQueryBuilder("letterBox").select(["letterBox"]);
            const sql = queryBuilder.getSql();

            expect(sql).includes("ST_AsText");

            await queryBuilder.getMany();
        })));
    });
});

runIfMain(import.meta);
