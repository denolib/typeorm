import {runIfMain} from "../../../../deps/mocha.ts";
import "../../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import {Student} from "./entity/Student.ts";
import {Employee} from "./entity/Employee.ts";
import {Person} from "./entity/Person.ts";

describe("table-inheritance > single-table > non-virtual-discriminator-column", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Employee, Person, Student]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should return non virtual discriminator column as well", () => Promise.all(connections.map(async connection => {

        // -------------------------------------------------------------------------
        // Create
        // -------------------------------------------------------------------------

        const student = new Student();
        student.name = "Alice";
        student.faculty = "Economics";
        await connection.getRepository(Student).save(student);

        const employee = new Employee();
        employee.name = "Roger";
        employee.salary = 1000;
        await connection.getRepository(Employee).save(employee);

        // -------------------------------------------------------------------------
        // Select
        // -------------------------------------------------------------------------

        let persons = await connection.manager
            .createQueryBuilder(Person, "person")
            .getMany();

        persons[0].id.should.be.equal(1);
        persons[0].type.should.be.equal("student-type");
        persons[0].name.should.be.equal("Alice");
        (persons[0] as Student).faculty.should.be.equal("Economics");

        persons[1].id.should.be.equal(2);
        persons[1].type.should.be.equal("employee-type");
        persons[1].name.should.be.equal("Roger");
        (persons[1] as Employee).salary.should.be.equal(1000);
    })));

});

runIfMain(import.meta);
