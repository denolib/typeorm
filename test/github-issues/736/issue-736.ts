import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Category} from "./entity/Category.ts";

describe("github issues > #736 ClosureEntity should set (composite) primary/unique key in the closure table", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Category],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should create composite primary key on closure ancestor and descendant", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("category_closure");
        table!.findColumnByName("id_ancestor")!.isPrimary.should.be.true;
        table!.findColumnByName("id_descendant")!.isPrimary.should.be.true;
        await queryRunner.release();
    })));

});

runIfMain(import.meta);
