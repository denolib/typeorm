import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {ObjectLiteral} from "../../../src";
import {Post} from "./entity/Post";
import {DateUtils} from "../../../src/util/DateUtils";

describe("github issues > #513 Incorrect time/datetime types for SQLite", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["sqlite"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should create datetime column type for datetime in sqlite", () => Promise.all(connections.map(async connection => {
      const dbColumns: ObjectLiteral[] = await connection.manager.query("PRAGMA table_info(Post)");
      expect(dbColumns).not.toBeNull();
      expect(dbColumns).not.toBeUndefined();

      let columnType: string = "";
      dbColumns.map((dbColumn) => {
        if (dbColumn["name"] === "dateTimeColumn") {
          columnType = dbColumn["type"];
        }        
      });

      // Expect "datetime" type to translate to SQLite affinity type "DATETIME"
      expect(columnType).toEqual("datetime");
    })));
    
    test("should persist correct type in datetime column in sqlite", () => Promise.all(connections.map(async connection => {
      const now: Date = new Date();

      const post: Post = new Post();
      post.id = 1;
      post.dateTimeColumn = now;
      
      await connection.manager.save(post);

      const storedPost = await connection.manager.findOne(Post, post.id);
      expect(storedPost).not.toBeNull();
      expect(storedPost!.dateTimeColumn.toDateString()).toEqual(now.toDateString());
    })));

    test("should create datetime column type for time in sqlite", () => Promise.all(connections.map(async connection => {
      const dbColumns: ObjectLiteral[] = await connection.manager.query("PRAGMA table_info(Post)");
      expect(dbColumns).not.toBeNull();
      expect(dbColumns).not.toBeUndefined();

      let columnType: string = "";
      dbColumns.map((dbColumn) => {
        if (dbColumn["name"] === "timeColumn") {
          columnType = dbColumn["type"];
        }        
      });

      // Expect "time" type to translate to SQLite type "TEXT"
      expect(columnType).toEqual("time");
    })));

    test("should persist correct type in datetime column in sqlite", () => Promise.all(connections.map(async connection => {
      const now: Date = new Date();

      const post: Post = new Post();
      post.id = 2;
      post.timeColumn = now; // Should maybe use Date type?
      
      await connection.manager.save(post);

      const storedPost = await connection.manager.findOne(Post, post.id);
      expect(storedPost).not.toBeNull();

      const expectedTimeString = DateUtils.mixedTimeToString(now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
      expect(storedPost!.timeColumn.toString()).toEqual(expectedTimeString);
    })));

});
