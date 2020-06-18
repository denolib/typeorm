import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, reloadTestingDatabases, setupSingleTestingConnection} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {createConnection, Repository} from "../../../src/index.ts";

import {Bar} from "./entity/Bar.ts";
import {DocumentEnum} from "./documentEnum.ts";

describe("github issues > #2871 Empty enum array is returned as array with single empty string", () => {
  let connection: Connection;
  let repository: Repository<Bar>;

  before(async () => {
      const options = setupSingleTestingConnection("postgres", {
          entities: [Bar],
          schemaCreate: true,
          dropSchema: true,
      });

      if (!options)
          return;

      connection = await createConnection(options);
  });
  beforeEach(async () => {
      if (!connection)
          return;
    await reloadTestingDatabases([connection]);
    repository = connection.getRepository(Bar);
  });
  after(() => closeTestingConnections([connection]));

  it("should extract array with values from enum array values from 'postgres'", async () => {
      if (!connection)
          return;
    const documents: DocumentEnum[] = [DocumentEnum.DOCUMENT_A, DocumentEnum.DOCUMENT_B, DocumentEnum.DOCUMENT_C];

    const barSaved = await repository.save({documents}) as Bar;
    const barFromDb = await repository.findOne(barSaved.barId) as Bar;

    expect(barFromDb.documents).to.eql(documents);
  });

  it("should extract array with one value from enum array with one value from 'postgres'", async () => {
      if (!connection)
          return;
    const documents: DocumentEnum[] = [DocumentEnum.DOCUMENT_D];

    const barSaved = await repository.save({documents}) as Bar;
    const barFromDb = await repository.findOne(barSaved.barId) as Bar;

    expect(barFromDb.documents).to.eql(documents);
  });

  // This `it` test that issue #2871 is fixed
  it("should extract empty array from empty enum array from 'postgres'", async () => {
      if (!connection)
          return;
    const documents: DocumentEnum[] = [];

    const barSaved = await repository.save({documents}) as Bar;
    const barFromDb = await repository.findOne(barSaved.barId) as Bar;

    expect(barFromDb.documents).to.eql(documents);
  });
});

runIfMain(import.meta);
