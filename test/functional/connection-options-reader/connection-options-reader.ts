import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule} from "../../utils/test-utils.ts";
import {ConnectionOptions} from "../../../src/connection/ConnectionOptions.ts";
import {ConnectionOptionsReader} from "../../../src/connection/ConnectionOptionsReader.ts";

describe("ConnectionOptionsReader", () => {
  const __dirname = getDirnameOfCurrentModule(import.meta);
  after(() => {
    Deno.env.delete("TYPEORM_CONNECTION");
    Deno.env.delete("TYPEORM_DATABASE");
  });

  it("properly loads config with entities specified", async function() {
    type EntititesList = Function[] | string[];
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/class-entities" });
    const options: ConnectionOptions = await connectionOptionsReader.get("test-conn");
    expect(options.entities).to.be.an.instanceOf(Array);
    const entities: EntititesList = options.entities as EntititesList;
    expect(entities.length).to.equal(1);
  });

  it("properly loads sqlite in-memory/path config", async () => {
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/sqlite-memory" });
    const inmemoryOptions: ConnectionOptions = await connectionOptionsReader.get("memory");
    expect(inmemoryOptions.database).to.equal(":memory:");
    const fileOptions: ConnectionOptions = await connectionOptionsReader.get("file");
    expect(fileOptions.database).to.have.string("/test");
  });

  it("properly loads config with specified file path", async () => {
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/test-path-config.js" });
    const fileOptions: ConnectionOptions = await connectionOptionsReader.get("file");
    expect(fileOptions.database).to.have.string("/test-js");
  });

  it("properly loads asynchronous config with specified file path", async () => {
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/test-path-config-async.js" });
    const fileOptions: ConnectionOptions = await connectionOptionsReader.get("file");
    expect(fileOptions.database).to.have.string("/test-js-async");
  });

  it("properly loads config from .yml file", async () => {
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/config.yml" });
    const defaultOptions: ConnectionOptions = await connectionOptionsReader.get("default");
    const sampleOptions: ConnectionOptions = await connectionOptionsReader.get("sample");
    expect(defaultOptions.type).to.equal("sqlite");
    expect(defaultOptions.database).to.have.string("sqlitedb");
    expect(sampleOptions.type).to.equal("mysql");
    expect(sampleOptions.database).to.equal("mysqldb");
  });

  it("properly loads config from .env file", async () => {
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/.env" });
    const [ fileOptions ]: ConnectionOptions[] = await connectionOptionsReader.all();
    expect(fileOptions.database).to.have.string("test-js");
    expect(Deno.env.toObject().TYPEORM_DATABASE).to.equal("test-js");
  });
});

runIfMain(import.meta);
