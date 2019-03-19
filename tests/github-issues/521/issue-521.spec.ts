import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Car} from "./entity/Car";

describe("github issues > #521 Attributes in UPDATE in QB arent getting replaced", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should replace parameters", () => Promise.all(connections.map(async connection => {

        const qb = connection.getRepository(Car).createQueryBuilder("car");
        const [query, parameters] = qb
            .update({
                name: "Honda",
            })
            .where("name = :name", {
                name: "Toyota",
            })
            .getQueryAndParameters();
        expect(query).not.toBeUndefined();
        expect(query).not.toEqual("");
        return expect(parameters.length).toEqual(2);
    })));

});
