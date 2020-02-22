import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {EntitySchema, InsertResult} from "../../../src/index.ts";

describe("github issues > #1510 entity schema does not support mode=objectId", () => {

    const UserEntity = new EntitySchema<any>({
        name: "User",
        tableName: "test_1510_users",
        columns: {
            _id: {
                type: "int",
                objectId: true,
                primary: true,
                generated: true,
            },
            name: {
                type: String,
            }
        }
    });

    const UserWithoutObjectIDEntity = new EntitySchema<any>({
        name: "UserWithoutObjectID",
        tableName: "test_1510_users2",
        columns: {
            _id: {
                type: "int",
                primary: true,
                generated: true,
            },
            name: {
                type: String,
            }
        }
    });
    const __dirname = getDirnameOfCurrentModule(import.meta);

    let connections: Connection[];
    before(async () => {
        return connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts"), UserEntity, UserWithoutObjectIDEntity],
            enabledDrivers: ["mongodb"]
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("throws an error because there is no object id defined", () => Promise.all(connections.map(async connection => {
        const repo = connection.getRepository("UserWithoutObjectID");

        try {
            await repo.insert({
                name: "Dotan",
            });

            expect(true).to.be.false;
        } catch (e) {
            expect(e.message).to.eq("Cannot read property 'createValueMap' of undefined");
        }
    })));

    it("should create entities without throwing an error when objectId is defined", () => Promise.all(connections.map(async connection => {
        const repo = connection.getRepository("User");

        const result: InsertResult = await repo.insert({
            name: "Dotan",
        });

        const insertedId = result.identifiers[0];

        expect(insertedId).not.to.be.undefined;
    })));

});

runIfMain(import.meta);
