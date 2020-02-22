import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { ConnectionOptions } from "../../../src/connection/ConnectionOptions.ts";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases, getTypeOrmConfig } from "../../utils/test-utils.ts";

import { PgEntity } from "./entity/pgEntity.ts";
import { MysqlEntity } from "./entity/mysqlEntity.ts";
import { MariadbEntity } from "./entity/mariadbEntity.ts";
import { MssqlEntity } from "./entity/mssqlEntity.ts";



const toISOString = (input: string) => new Date(input).toISOString();


const convertPropsToISOStrings = (obj: any, props: string[]) => {
    props.map(prop => {
        obj[prop] = toISOString(obj[prop]);
    });
};


const isDriverEnabled = (driver: string) => {
    const ormConfigConnectionOptionsArray = getTypeOrmConfig();
    const config = ormConfigConnectionOptionsArray.find((options: ConnectionOptions) => options.name === driver);
    return config && !config.skip;
};


describe("github issues > #1716 send timestamp to database without converting it into UTC", () => {


    describe("postgres", async () => {

        if (!isDriverEnabled("postgres")) {
            return;
        }

        let connections: Connection[];

        before(async () => {
            connections = await createTestingConnections({
                entities: [PgEntity],
                schemaCreate: true,
                dropSchema: true,
                enabledDrivers: [
                    "postgres"
                ]
            });
        });

        beforeEach(() => reloadTestingDatabases(connections));
        after(() => closeTestingConnections(connections));


        it("should persist dates and times correctly", async () => {

            const manager = connections[0].manager;


            await manager.save(PgEntity, {
                id: 1,
                fieldTime: "14:00:00+05",
                fieldTimeWithTZ: "14:00:00+05",
                fieldTimeWithoutTZ: "14:00:00+05",
                fieldTimestamp: "2018-03-07 14:00:00+05",
                fieldTimestampWithoutTZ: "2018-03-07 14:00:00+05",
                fieldTimestampWithTZ: "2018-03-07 14:00:00+05",
            });

            const result1 = await manager.findOne(PgEntity, 1);
            convertPropsToISOStrings(result1, ["fieldTimestamp", "fieldTimestampWithoutTZ", "fieldTimestampWithTZ"]);

            expect(result1).to.deep.equal({
                id: 1,
                fieldTime: "14:00:00",
                fieldTimeWithTZ: "14:00:00+05",
                fieldTimeWithoutTZ: "14:00:00",
                fieldTimestamp: toISOString("2018-03-07 14:00:00+05"),
                fieldTimestampWithoutTZ: toISOString("2018-03-07 14:00:00+05"),
                fieldTimestampWithTZ: toISOString("2018-03-07 14:00:00+05"),
            });



            await manager.save(PgEntity, {
                id: 2,
                fieldTime: "17:00:00",
                fieldTimeWithTZ: "17:00:00",
                fieldTimeWithoutTZ: "17:00:00",
                fieldTimestamp: "2018-03-07 17:00:00",
                fieldTimestampWithoutTZ: "2018-03-07 17:00:00",
                fieldTimestampWithTZ: "2018-03-07 17:00:00",
            });

            const result2 = await manager.findOne(PgEntity, 2);
            convertPropsToISOStrings(result2, ["fieldTimestamp", "fieldTimestampWithoutTZ", "fieldTimestampWithTZ"]);

            expect(result2).to.deep.equal({
                id: 2,
                fieldTime: "17:00:00",
                fieldTimeWithTZ: "17:00:00+00",
                fieldTimeWithoutTZ: "17:00:00",
                fieldTimestamp: toISOString("2018-03-07 17:00:00"),
                fieldTimestampWithoutTZ: toISOString("2018-03-07 17:00:00"),
                fieldTimestampWithTZ: toISOString("2018-03-07 17:00:00"),
            });

        });

    });



    describe("mysql", async () => {

        if (!isDriverEnabled("mysql")) {
            return;
        }

        let connections: Connection[];

        before(async () => {
            connections = await createTestingConnections({
                entities: [MysqlEntity],
                schemaCreate: true,
                dropSchema: true,
                enabledDrivers: [
                    "mysql"
                ]
            });
        });

        beforeEach(() => reloadTestingDatabases(connections));
        after(() => closeTestingConnections(connections));


        it("should persist dates and times correctly", async () => {

            const manager = connections[0].manager;


            await manager.save(MysqlEntity, {
                id: 1,
                fieldTime: "14:00:00",
                fieldTimestamp: "2018-03-07 14:00:00+05",
                fieldDatetime: "2018-03-07 14:00:00+05",
            });

            const result1 = await manager.findOne(MysqlEntity, 1);
            convertPropsToISOStrings(result1, ["fieldTimestamp", "fieldDatetime"]);

            expect(result1).to.deep.equal({
                id: 1,
                fieldTime: "14:00:00",
                fieldTimestamp: toISOString("2018-03-07 14:00:00+05"),
                fieldDatetime: toISOString("2018-03-07 14:00:00+05"),
            });



            await manager.save(MysqlEntity, {
                id: 2,
                fieldTime: "17:00:00",
                fieldTimestamp: "2018-03-07 17:00:00",
                fieldDatetime: "2018-03-07 17:00:00",
            });

            const result2 = await manager.findOne(MysqlEntity, 2);
            convertPropsToISOStrings(result2, ["fieldTimestamp", "fieldDatetime"]);

            expect(result2).to.deep.equal({
                id: 2,
                fieldTime: "17:00:00",
                fieldTimestamp: toISOString("2018-03-07 17:00:00"),
                fieldDatetime: toISOString("2018-03-07 17:00:00"),
            });

        });

    });



    describe("mariadb", async () => {

        if (!isDriverEnabled("mariadb")) {
            return;
        }

        let connections: Connection[];

        before(async () => {
            connections = await createTestingConnections({
                entities: [MariadbEntity],
                schemaCreate: true,
                dropSchema: true,
                enabledDrivers: [
                    "mariadb"
                ]
            });
        });

        beforeEach(() => reloadTestingDatabases(connections));
        after(() => closeTestingConnections(connections));


        it("should persist dates and times correctly", async () => {

            const manager = connections[0].manager;


            await manager.save(MariadbEntity, {
                id: 1,
                fieldTime: "14:00:00",
                fieldTimestamp: "2018-03-07 14:00:00+05",
                fieldDatetime: "2018-03-07 14:00:00+05",
            });

            const result1 = await manager.findOne(MariadbEntity, 1);
            convertPropsToISOStrings(result1, ["fieldTimestamp", "fieldDatetime"]);

            expect(result1).to.deep.equal({
                id: 1,
                fieldTime: "14:00:00",
                fieldTimestamp: toISOString("2018-03-07 14:00:00+05"),
                fieldDatetime: toISOString("2018-03-07 14:00:00+05"),
            });



            await manager.save(MariadbEntity, {
                id: 2,
                fieldTime: "17:00:00",
                fieldTimestamp: "2018-03-07 17:00:00",
                fieldDatetime: "2018-03-07 17:00:00",
            });

            const result2 = await manager.findOne(MariadbEntity, 2);
            convertPropsToISOStrings(result2, ["fieldTimestamp", "fieldDatetime"]);

            expect(result2).to.deep.equal({
                id: 2,
                fieldTime: "17:00:00",
                fieldTimestamp: toISOString("2018-03-07 17:00:00"),
                fieldDatetime: toISOString("2018-03-07 17:00:00"),
            });

        });

    });



    describe("mssql", async () => {

        if (!isDriverEnabled("mssql")) {
            return;
        }

        let connections: Connection[];

        before(async () => {
            connections = await createTestingConnections({
                entities: [MssqlEntity],
                schemaCreate: true,
                dropSchema: true,
                enabledDrivers: [
                    "mssql"
                ]
            });
        });

        beforeEach(() => reloadTestingDatabases(connections));
        after(() => closeTestingConnections(connections));


        it("should persist dates and times correctly", async () => {

            const manager = connections[0].manager;


            await manager.save(MssqlEntity, {
                id: 1,
                fieldTime: "14:00:00",
                fieldDatetime: "2018-03-07 14:00:00+05",
                fieldDatetime2: "2018-03-07 14:00:00+05",
                fieldDatetimeoffset: "2018-03-07 14:00:00+05",
            });

            const result1 = await manager.findOne(MssqlEntity, 1);
            convertPropsToISOStrings(result1, ["fieldDatetime", "fieldDatetime2", "fieldDatetimeoffset"]);

            expect(result1).to.deep.equal({
                id: 1,
                fieldTime: "14:00:00",
                fieldDatetime: toISOString("2018-03-07 14:00:00+05"),
                fieldDatetime2: toISOString("2018-03-07 14:00:00+05"),
                fieldDatetimeoffset: toISOString("2018-03-07 14:00:00+05"),
            });



            await manager.save(MssqlEntity, {
                id: 2,
                fieldTime: "17:00:00",
                fieldDatetime: "2018-03-07 17:00:00",
                fieldDatetime2: "2018-03-07 17:00:00",
                fieldDatetimeoffset: "2018-03-07 17:00:00",
            });

            const result2 = await manager.findOne(MssqlEntity, 2);
            convertPropsToISOStrings(result2, ["fieldDatetime", "fieldDatetime2", "fieldDatetimeoffset"]);

            expect(result2).to.deep.equal({
                id: 2,
                fieldTime: "17:00:00",
                fieldDatetime: toISOString("2018-03-07 17:00:00"),
                fieldDatetime2: toISOString("2018-03-07 17:00:00"),
                fieldDatetimeoffset: toISOString("2018-03-07 17:00:00"),
            });

        });

    });

});

runIfMain(import.meta);
