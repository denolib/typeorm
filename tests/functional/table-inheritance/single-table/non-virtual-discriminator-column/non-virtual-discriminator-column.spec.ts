import "reflect-metadata";
import {Connection} from "../../../../../src";
import {Student} from "./entity/Student";
import {Employee} from "./entity/Employee";
import {Person} from "./entity/Person";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../utils/test-utils";

describe("table-inheritance > single-table > non-virtual-discriminator-column", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should return non virtual discriminator column as well", () => Promise.all(connections.map(async connection => {

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

        expect(persons[0].id).toEqual(1);
        expect(persons[0].type).toEqual("student-type");
        expect(persons[0].name).toEqual("Alice");
        expect((persons[0] as Student).faculty).toEqual("Economics");

        expect(persons[1].id).toEqual(2);
        expect(persons[1].type).toEqual("employee-type");
        expect(persons[1].name).toEqual("Roger");
        expect((persons[1] as Employee).salary).toEqual(1000);
    })));

});
