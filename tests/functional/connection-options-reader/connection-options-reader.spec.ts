import {ConnectionOptions} from "../../../src";
import {ConnectionOptionsReader} from "../../../src";

describe("ConnectionOptionsReader", () => {
  afterAll(() => {
    delete process.env.TYPEORM_CONNECTION;
    delete process.env.TYPEORM_DATABASE;
  });

  test("properly loads config with entities specified", async () => {
    type EntititesList = Function[] | string[];
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/class-entities" });
    const options: ConnectionOptions = await connectionOptionsReader.get("test-conn");
    expect(options.entities).toBeInstanceOf(Array);
    const entities: EntititesList = options.entities as EntititesList;
    expect(entities.length).toEqual(1);
  });

  test("properly loads sqlite in-memory/path config", async () => {
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/sqlite-memory" });
    const inmemoryOptions: ConnectionOptions = await connectionOptionsReader.get("memory");
    expect(inmemoryOptions.database).toEqual(":memory:");
    const fileOptions: ConnectionOptions = await connectionOptionsReader.get("file");
    expect(fileOptions.database).toContain("/test");
  });

  test("properly loads config with specified file path", async () => {
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/test-path-config.ts" });
    const fileOptions: ConnectionOptions = await connectionOptionsReader.get("file");
    expect(fileOptions.database).toContain("/test-js");
  });

  // TODO This test requires the configs/.env file be moved to the matching directory in build/compiled
  test.skip("properly loads config from .env file", async () => {
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/.env" });
    const [ fileOptions ]: ConnectionOptions[] = await connectionOptionsReader.all();
    expect(fileOptions.database).toContain("test-js");
    expect(process.env.TYPEORM_DATABASE).toEqual("test-js");
  });
});
