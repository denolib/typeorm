import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Car} from "./entity/Car.ts";

describe("github issues > #521 Attributes in UPDATE in QB arent getting replaced", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Car],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should replace parameters", () => Promise.all(connections.map(async connection => {

        const qb = connection.getRepository(Car).createQueryBuilder("car");
        const [query, parameters] = qb
            .update({
                name: "Honda",
            })
            .where("name = :name", {
                name: "Toyota",
            })
            .getQueryAndParameters();
        query.should.not.be.undefined;
        query.should.not.be.eql("");
        return parameters.length.should.eql(2);
    })));

});

runIfMain(import.meta);
