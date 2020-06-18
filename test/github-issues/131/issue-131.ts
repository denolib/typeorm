import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Student} from "./entity/Student.ts";
import {Person} from "./entity/Person.ts";
import {Employee} from "./entity/Employee.ts";

describe("github issues > #131 Error with single table inheritance query without additional conditions", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Employee, Person, Student],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not fail when querying for single table inheritance model without additional conditions", () => Promise.all(connections.map(async connection => {
        const employees = await connection.getRepository(Employee).find();
        expect(employees).not.to.be.undefined;

        const students = await connection.getRepository(Student).find();
        expect(students).not.to.be.undefined;
    })));

});

runIfMain(import.meta);
