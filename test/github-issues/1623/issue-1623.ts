import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {ColumnMetadata} from "../../../src/metadata/ColumnMetadata.ts";
import {ColumnMetadataArgs} from "../../../src/metadata-args/ColumnMetadataArgs.ts";
import {User} from "./entity/User.ts";

describe("github issues > #1623 NOT NULL constraint failed after a new column is added (SQLite)", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [User],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly add new column", () => Promise.all(connections.map(async connection => {

        const userMetadata = connection.getMetadata(User);

        const columnMetadata = new ColumnMetadata({
            connection: connection,
            entityMetadata: userMetadata,
            args: <ColumnMetadataArgs>{
                target: User,
                propertyName: "userName",
                mode: "regular",
                options: {
                    type: "varchar",
                    name: "userName"
                }
            }
        });
        columnMetadata.build(connection);

        userMetadata.columns.push(columnMetadata);

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("user");
        const column1 = table!.findColumnByName("userName")!;
        await queryRunner.release();

        column1.should.be.exist;
    })));

});

runIfMain(import.meta);
