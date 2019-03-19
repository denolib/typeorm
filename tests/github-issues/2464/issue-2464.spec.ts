import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import { Foo } from "./entity/Foo";
import { QueryFailedError } from "../../../src";

describe("github issues > #2464 - ManyToMany onDelete option not working", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"]
    }));

    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not delete when onDelete is 'NO ACTION'", () => Promise.all(
      connections.map(async connection => {
        const repo = connection.getRepository(Foo);

        await repo.save({ id: 1, bars: [{ description: "test1" }] });

        try {
          await repo.delete(1);
          fail();
        } catch (e) {
          expect(e).toBeInstanceOf(QueryFailedError);
        }
        
      })
    ));

    test("should delete when onDelete is not set", () => Promise.all(
      connections.map(async connection => {
        const repo = connection.getRepository(Foo);

        await repo.save({ id: 1, otherBars: [{ description: "test1" }] });
        await repo.delete(1);

        const foo = await repo.findOne(1);
        expect(foo).toBeUndefined();
        
      })
    ));

});
