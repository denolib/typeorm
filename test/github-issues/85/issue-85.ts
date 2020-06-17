import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Connection} from "../../../src/index.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Document} from "./entity/Document.ts";

describe("github issues > #85 - Column option insert: false, update: false", () => {

    let connections: Connection[];

    before(async () => connections = await createTestingConnections({
        entities: [Document],
        schemaCreate: true,
        dropSchema: true
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

  it("should ignore value of non-inserted column", () => Promise.all(connections.map(async connection => {
    const doc1 = new Document();
    doc1.id = 1;
    doc1.version = 42;
    await connection.manager.save(doc1);
    const docs = connection.getRepository(Document);
    const doc2 = await docs.findOne();
    expect(doc2!.version).to.be.equal(1);
  })));

  it("should be able to create an entity with column entirely missing", () => Promise.all(connections.map(async connection => {
    // We delete the non-inserted column entirely, so that any use of it will throw an error.
    let queryRunner = connection.createQueryRunner();
    await queryRunner.dropColumn("document", "permission");
    await queryRunner.release();

    const doc1 = new Document();
    doc1.id = 1;
    await connection.manager.save(doc1);
    const docs = connection.getRepository(Document);
    // We got here without throwing an error, which is good news.
    expect(await docs.count()).to.eql(1);

    // And just to confirm that the above test is meaningful, we drop a regular column
    // and see that creating an entity does throw an error.
    queryRunner = connection.createQueryRunner();
    await queryRunner.dropColumn("document", "name");
    await queryRunner.release();
    const doc2 = new Document();
    doc2.id = 2;

    let error;
    try {
        await connection.manager.save(doc2);
    } catch (err) {
        error = err;
    }
    expect(error).to.be.instanceOf(Error);
  })));
});

runIfMain(import.meta);
