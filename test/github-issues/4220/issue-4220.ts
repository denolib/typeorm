import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";

describe("github issues > #4220 Fix the bug when using buffer as the key.", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        schemaCreate: true,
        dropSchema: true,
        enabledDrivers: ["mysql", "mssql"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should use the hex string format of buffer when the primary column is buffer type.", () => Promise.all(connections.map(async connection => {
       const encoder = new TextEncoder();
       const decoder = new TextDecoder();
       const ids = [
        "11E9845B84B510E0A99EDBC51EED5BB5",
        "11E9845B84C27E60A99EDBC51EED5BB5",
        "11E9845B84D961C0A99EDBC51EED5BB5",
        "11E9845B84DD8070A99EDBC51EED5BB5",
        "11E9845B84E102E0A99EDBC51EED5BB5",
        "11E9845B84E4D370A99EDBC51EED5BB5",
        "11E9845B84E855E0A99EDBC51EED5BB5",
        "11E9845B84EBD850A99EDBC51EED5BB5",
        "11E9845B84EFF700A99EDBC51EED5BB5",
        "11E9845B84F415B0A99EDBC51EED5BB5",
        "11E9845B84FA5740A99EDBC51EED5BB5",
        "11E9845B84FEC410A99EDBC51EED5BB5",
        "11E9845B850C0A80A99EDBC51EED5BB5",
        "11E9845B850FB400A99EDBC51EED5BB5",
        "11E9845B85138490A99EDBC51EED5BB5",
        "11E9845B851950F0A99EDBC51EED5BB5",
        "11E9845B851D6FA0A99EDBC51EED5BB5",
        "11E9845B85214030A99EDBC51EED5BB5",
        "11E9845B852510C0A99EDBC51EED5BB5",
       ];

       const repo = await connection.getRepository(User);

        await Promise.all(
        [...Array(10)].map((_, index) => {
            const user = new User();
            user.name = "random-name";
            user.id = encoder.encode(ids[index]);//Buffer.from(ids[index], "hex");
            return user;
        }).map(user => repo.save(user))
      );

      const result = await repo
      .createQueryBuilder("user")
      .getMany();

      expect(result.length).equal(10);
      //expect(result[0].id.toString("hex").toUpperCase()).equal(ids[0]);
      expect(decoder.decode(result[0].id)).equal(ids[0]);
    })));
});

runIfMain(import.meta);
