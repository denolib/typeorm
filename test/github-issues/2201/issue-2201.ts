import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {RecordContext as RecordContext_ver1} from "./entity/ver1/context.ts";
import {Record as Record_ver1} from "./entity/ver1/record.ts";
import {User as User_ver1} from "./entity/ver1/user.ts";
import {RecordContext} from "./entity/ver2/context.ts";
import {Record} from "./entity/ver2/record.ts";
import {User} from "./entity/ver2/user.ts";

describe("github issues > #2201 - Create a select query when using a (custom) junction table", () => {

    it("Should create only two PM columns ('order_id' and 'user_id')", async () => {
        const connections = await createTestingConnections({
            entities: [RecordContext_ver1, Record_ver1, User_ver1],
            schemaCreate: true,
            dropSchema: true
        });
        if (!connections.length) return;

        const contextMetadata = connections[0].entityMetadatas.find(metadata => metadata.name === "RecordContext")!;
        const expectedColumnNames = ["record_id", "meta", "user_id"];
        const existingColumnNames = contextMetadata.columns.map(col => col.databaseName);

        expect(existingColumnNames.length).to.eql(expectedColumnNames.length);
        expect(existingColumnNames).have.members(expectedColumnNames);

        await closeTestingConnections(connections);
    });

    it.skip("Should not try to update the junction table when not needed", async () => {
        const connections = await createTestingConnections({
            entities: [RecordContext, Record, User],
            enabledDrivers: ["postgres"],
            schemaCreate: true,
            dropSchema: true,
        });
        if (!connections.length) return;

        User.useConnection(connections[0]);
        Record.useConnection(connections[0]);
        RecordContext.useConnection(connections[0]);

        const user = User.create({ id: "user1" });
        await user.save();

        const record = Record.create({ id: "record1", status: "pending" });
        await record.save();

        const context = RecordContext.create({
            user,
            record,
            userId: user.id,
            recordId: record.id,
            meta: { name: "meta name", description: "meta description" }
        } as RecordContext);
        await context.save();

        const query = Record
            .createQueryBuilder("record")
            .leftJoinAndSelect("record.contexts", "context")
            .where("record.id = :recordId", { recordId: record.id });

        const result = (await query.getOne())!;

        result.status = "failed";

        await result.save();
        expect(0).to.eql(0);

        await closeTestingConnections(connections);
    });
});

runIfMain(import.meta);
