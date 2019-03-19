import "reflect-metadata";
import {closeTestingConnections, reloadTestingDatabases, setupSingleTestingConnection} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {createConnection, Repository} from "../../../src";

import {Bar} from "./entity/Bar";
import {DocumentEnum} from "./documentEnum";

describe("github issues > #2871 Empty enum array is returned as array with single empty string", () => {
  let connection: Connection;
  let repository: Repository<Bar>;

  beforeAll(async () => {
      const options = setupSingleTestingConnection("postgres", {
          entities: [__dirname + "/entity/*{.js,.ts}"],
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
  afterAll(() => closeTestingConnections([connection]));

  test("should extract array with values from enum array values from 'postgres'", async () => {
      if (!connection)
          return;
    const documents: DocumentEnum[] = [DocumentEnum.DOCUMENT_A, DocumentEnum.DOCUMENT_B, DocumentEnum.DOCUMENT_C];

    const barSaved = await repository.save({documents}) as Bar;
    const barFromDb = await repository.findOne(barSaved.barId) as Bar;

    expect(barFromDb.documents).toEqual(documents);
  });

  test("should extract array with one value from enum array with one value from 'postgres'", async () => {
      if (!connection)
          return;
    const documents: DocumentEnum[] = [DocumentEnum.DOCUMENT_D];

    const barSaved = await repository.save({documents}) as Bar;
    const barFromDb = await repository.findOne(barSaved.barId) as Bar;

    expect(barFromDb.documents).toEqual(documents);
  });

  // This `it` test that issue #2871 is fixed
  test("should extract empty array from empty enum array from 'postgres'", async () => {
      if (!connection)
          return;
    const documents: DocumentEnum[] = [];

    const barSaved = await repository.save({documents}) as Bar;
    const barFromDb = await repository.findOne(barSaved.barId) as Bar;

    expect(barFromDb.documents).toEqual(documents);
  });
});
