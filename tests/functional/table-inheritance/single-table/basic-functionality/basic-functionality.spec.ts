import "reflect-metadata";
import {Connection} from "../../../../../src";
import {Student} from "./entity/Student";
import {Teacher} from "./entity/Teacher";
import {Accountant} from "./entity/Accountant";
import {Employee} from "./entity/Employee";
import {Person} from "./entity/Person";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../utils/test-utils";

describe("table-inheritance > single-table > basic-functionality", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly insert, update and delete data with single-table-inheritance pattern", () => Promise.all(connections.map(async connection => {

        // -------------------------------------------------------------------------
        // Create
        // -------------------------------------------------------------------------

        const student1 = new Student();
        student1.name = "Alice";
        student1.faculty = "Economics";
        await connection.getRepository(Student).save(student1);

        const student2 = new Student();
        student2.name = "Bob";
        student2.faculty = "Programming";
        await connection.getRepository(Student).save(student2);

        const teacher1 = new Teacher();
        teacher1.name = "Mr. Garrison";
        teacher1.specialization = "Geography";
        teacher1.salary = 2000;
        await connection.getRepository(Teacher).save(teacher1);

        const teacher2 = new Teacher();
        teacher2.name = "Mr. Adler";
        teacher2.specialization = "Mathematics";
        teacher2.salary = 4000;
        await connection.getRepository(Teacher).save(teacher2);

        const accountant1 = new Accountant();
        accountant1.name = "Mr. Burns";
        accountant1.department = "Bookkeeping";
        accountant1.salary = 3000;
        await connection.getRepository(Accountant).save(accountant1);

        const accountant2 = new Accountant();
        accountant2.name = "Mr. Trump";
        accountant2.department = "Director";
        accountant2.salary = 5000;
        await connection.getRepository(Accountant).save(accountant2);

        // -------------------------------------------------------------------------
        // Select
        // -------------------------------------------------------------------------

        let loadedStudents = await connection.manager
            .createQueryBuilder(Student, "students")
            .orderBy("students.id")
            .getMany();

        expect(loadedStudents[0]).toHaveProperty("id");
        expect(loadedStudents[0]).toHaveProperty("name");
        expect(loadedStudents[0]).toHaveProperty("faculty");
        expect(loadedStudents[0].id).toEqual(1);
        expect(loadedStudents[0].name).toEqual("Alice");
        expect(loadedStudents[0].faculty).toEqual("Economics");
        expect(loadedStudents[1]).toHaveProperty("id");
        expect(loadedStudents[1]).toHaveProperty("name");
        expect(loadedStudents[1]).toHaveProperty("faculty");
        expect(loadedStudents[1].id).toEqual(2);
        expect(loadedStudents[1].name).toEqual("Bob");
        expect(loadedStudents[1].faculty).toEqual("Programming");

        let loadedTeachers = await connection.manager
            .createQueryBuilder(Teacher, "teachers")
            .orderBy("teachers.id")
            .getMany();

        expect(loadedTeachers[0]).toHaveProperty("id");
        expect(loadedTeachers[0]).toHaveProperty("name");
        expect(loadedTeachers[0]).toHaveProperty("specialization");
        expect(loadedTeachers[0]).toHaveProperty("salary");
        expect(loadedTeachers[0].id).toEqual(3);
        expect(loadedTeachers[0].name).toEqual("Mr. Garrison");
        expect(loadedTeachers[0].specialization).toEqual("Geography");
        expect(loadedTeachers[0].salary).toEqual(2000);
        expect(loadedTeachers[1]).toHaveProperty("id");
        expect(loadedTeachers[1]).toHaveProperty("name");
        expect(loadedTeachers[1]).toHaveProperty("specialization");
        expect(loadedTeachers[1]).toHaveProperty("salary");
        expect(loadedTeachers[1].id).toEqual(4);
        expect(loadedTeachers[1].name).toEqual("Mr. Adler");
        expect(loadedTeachers[1].specialization).toEqual("Mathematics");
        expect(loadedTeachers[1].salary).toEqual(4000);

        let loadedAccountants = await connection.manager
            .createQueryBuilder(Accountant, "accountants")
            .orderBy("accountants.id")
            .getMany();

        expect(loadedAccountants[0]).toHaveProperty("id");
        expect(loadedAccountants[0]).toHaveProperty("name");
        expect(loadedAccountants[0]).toHaveProperty("department");
        expect(loadedAccountants[0]).toHaveProperty("salary");
        expect(loadedAccountants[0].id).toEqual(5);
        expect(loadedAccountants[0].name).toEqual("Mr. Burns");
        expect(loadedAccountants[0].department).toEqual("Bookkeeping");
        expect(loadedAccountants[0].salary).toEqual(3000);
        expect(loadedAccountants[1]).toHaveProperty("id");
        expect(loadedAccountants[1]).toHaveProperty("name");
        expect(loadedAccountants[1]).toHaveProperty("department");
        expect(loadedAccountants[1]).toHaveProperty("salary");
        expect(loadedAccountants[1].id).toEqual(6);
        expect(loadedAccountants[1].name).toEqual("Mr. Trump");
        expect(loadedAccountants[1].department).toEqual("Director");
        expect(loadedAccountants[1].salary).toEqual(5000);

        // -------------------------------------------------------------------------
        // Update
        // -------------------------------------------------------------------------

        let loadedStudent = await connection.manager
            .createQueryBuilder(Student, "student")
            .where("student.name = :name", { name: "Bob" })
            .getOne();

        loadedStudent!.faculty = "Chemistry";
        await connection.getRepository(Student).save(loadedStudent!);

        loadedStudent = await connection.manager
            .createQueryBuilder(Student, "student")
            .where("student.name = :name", { name: "Bob" })
            .getOne();

        expect(loadedStudent!).toHaveProperty("id");
        expect(loadedStudent!).toHaveProperty("name");
        expect(loadedStudent!).toHaveProperty("faculty");
        expect(loadedStudent!.id).toEqual(2);
        expect(loadedStudent!.name).toEqual("Bob");
        expect(loadedStudent!.faculty).toEqual("Chemistry");

        let loadedTeacher = await connection.manager
            .createQueryBuilder(Teacher, "teacher")
            .where("teacher.name = :name", { name: "Mr. Adler" })
            .getOne();

        loadedTeacher!.salary = 1000;
        await connection.getRepository(Teacher).save(loadedTeacher!);

        loadedTeacher = await connection.manager
            .createQueryBuilder(Teacher, "teacher")
            .where("teacher.name = :name", { name: "Mr. Adler" })
            .getOne();

        expect(loadedTeacher!).toHaveProperty("id");
        expect(loadedTeacher!).toHaveProperty("name");
        expect(loadedTeacher!).toHaveProperty("specialization");
        expect(loadedTeacher!).toHaveProperty("salary");
        expect(loadedTeacher!.id).toEqual(4);
        expect(loadedTeacher!.name).toEqual("Mr. Adler");
        expect(loadedTeacher!.specialization).toEqual("Mathematics");
        expect(loadedTeacher!.salary).toEqual(1000);

        let loadedAccountant = await connection.manager
            .createQueryBuilder(Accountant, "accountant")
            .where("accountant.name = :name", { name: "Mr. Trump" })
            .getOne();

        loadedAccountant!.salary = 1000;
        await connection.getRepository(Accountant).save(loadedAccountant!);

        loadedAccountant = await connection.manager
            .createQueryBuilder(Accountant, "accountant")
            .where("accountant.name = :name", { name: "Mr. Trump" })
            .getOne();

        expect(loadedAccountant!).toHaveProperty("id");
        expect(loadedAccountant!).toHaveProperty("name");
        expect(loadedAccountant!).toHaveProperty("department");
        expect(loadedAccountant!).toHaveProperty("salary");
        expect(loadedAccountant!.id).toEqual(6);
        expect(loadedAccountant!.name).toEqual("Mr. Trump");
        expect(loadedAccountant!.department).toEqual("Director");
        expect(loadedAccountant!.salary).toEqual(1000);

        // -------------------------------------------------------------------------
        // Delete
        // -------------------------------------------------------------------------

        await connection.getRepository(Student).remove(loadedStudent!);

        loadedStudents = await connection.manager
            .createQueryBuilder(Student, "students")
            .orderBy("students.id")
            .getMany();

        expect(loadedStudents.length).toEqual(1);
        expect(loadedStudents[0]).toHaveProperty("id");
        expect(loadedStudents[0]).toHaveProperty("name");
        expect(loadedStudents[0]).toHaveProperty("faculty");
        expect(loadedStudents[0].id).toEqual(1);
        expect(loadedStudents[0].name).toEqual("Alice");
        expect(loadedStudents[0].faculty).toEqual("Economics");

        await connection.getRepository(Teacher).remove(loadedTeacher!);

        loadedTeachers = await connection.manager
            .createQueryBuilder(Teacher, "teachers")
            .orderBy("teachers.id")
            .getMany();

        expect(loadedTeachers.length).toEqual(1);
        expect(loadedTeachers[0]).toHaveProperty("id");
        expect(loadedTeachers[0]).toHaveProperty("name");
        expect(loadedTeachers[0]).toHaveProperty("specialization");
        expect(loadedTeachers[0]).toHaveProperty("salary");
        expect(loadedTeachers[0].id).toEqual(3);
        expect(loadedTeachers[0].name).toEqual("Mr. Garrison");
        expect(loadedTeachers[0].specialization).toEqual("Geography");
        expect(loadedTeachers[0].salary).toEqual(2000);

        await connection.getRepository(Accountant).remove(loadedAccountant!);

        loadedAccountants = await connection.manager
            .createQueryBuilder(Accountant, "accountants")
            .orderBy("accountants.id")
            .getMany();

        expect(loadedAccountants.length).toEqual(1);
        expect(loadedAccountants[0]).toHaveProperty("id");
        expect(loadedAccountants[0]).toHaveProperty("name");
        expect(loadedAccountants[0]).toHaveProperty("department");
        expect(loadedAccountants[0]).toHaveProperty("salary");
        expect(loadedAccountants[0].id).toEqual(5);
        expect(loadedAccountants[0].name).toEqual("Mr. Burns");
        expect(loadedAccountants[0].department).toEqual("Bookkeeping");
        expect(loadedAccountants[0].salary).toEqual(3000);

        // -------------------------------------------------------------------------
        // Select parent objects
        // -------------------------------------------------------------------------

        const loadedEmployees = await connection.manager
            .createQueryBuilder(Employee, "employees")
            .orderBy("employees.id")
            .getMany();

        expect(loadedEmployees[0]).toHaveProperty("id");
        expect(loadedEmployees[0]).toHaveProperty("name");
        expect(loadedEmployees[0]).toHaveProperty("salary");
        expect(loadedEmployees[0]).toHaveProperty("specialization");
        expect(loadedEmployees[0]).toBeInstanceOf(Teacher);
        expect(loadedEmployees[0].id).toEqual(3);
        expect(loadedEmployees[0].name).toEqual("Mr. Garrison");
        (loadedEmployees[0] as Teacher).specialization = "Geography";
        expect(loadedEmployees[0].salary).toEqual(2000);
        expect(loadedEmployees[1]).toHaveProperty("id");
        expect(loadedEmployees[1]).toHaveProperty("name");
        expect(loadedEmployees[1]).toHaveProperty("salary");
        expect(loadedEmployees[1]).toHaveProperty("department");
        expect(loadedEmployees[1]).toBeInstanceOf(Accountant);
        expect(loadedEmployees[1].id).toEqual(5);
        expect(loadedEmployees[1].name).toEqual("Mr. Burns");
        (loadedEmployees[1] as Accountant).department = "Bookkeeping";
        expect(loadedEmployees[1].salary).toEqual(3000);

        const loadedPersons = await connection.manager
            .createQueryBuilder(Person, "persons")
            .orderBy("persons.id")
            .getMany();

        expect(loadedPersons[0]).toHaveProperty("id");
        expect(loadedPersons[0]).toHaveProperty("name");
        expect(loadedPersons[0]).toHaveProperty("faculty");
        expect(loadedPersons[0]).toBeInstanceOf(Student);
        expect(loadedPersons[0].id).toEqual(1);
        expect(loadedPersons[0].name).toEqual("Alice");
        (loadedPersons[0] as Student).faculty = "Economics";

        expect(loadedPersons[1]).toHaveProperty("id");
        expect(loadedPersons[1]).toHaveProperty("name");
        expect(loadedPersons[1]).toHaveProperty("salary");
        expect(loadedPersons[1]).toHaveProperty("specialization");
        expect(loadedPersons[1]).toBeInstanceOf(Teacher);
        expect(loadedPersons[1].id).toEqual(3);
        expect(loadedPersons[1].name).toEqual("Mr. Garrison");
        (loadedPersons[1] as Teacher).specialization = "Geography";
        expect((loadedPersons[1] as Teacher).salary).toEqual(2000);

        expect(loadedPersons[2]).toHaveProperty("id");
        expect(loadedPersons[2]).toHaveProperty("name");
        expect(loadedPersons[2]).toHaveProperty("salary");
        expect(loadedPersons[2]).toHaveProperty("department");
        expect(loadedPersons[2]).toBeInstanceOf(Accountant);
        expect(loadedPersons[2].id).toEqual(5);
        expect(loadedPersons[2].name).toEqual("Mr. Burns");
        (loadedPersons[2] as Accountant).department = "Bookkeeping";
        expect((loadedPersons[2] as Accountant).salary).toEqual(3000);

    })));

    test("should be able to save different child entities in bulk", () => Promise.all(connections.map(async connection => {

        const student = new Student();
        student.name = "Alice";
        student.faculty = "Economics";

        const employee = new Employee();
        employee.name = "John";
        employee.salary = 1000;

        await connection.manager.save([student, employee]);

        expect(student.name).toEqual("Alice");
        expect(student.faculty).toEqual("Economics");
        expect(student).not.toHaveProperty("department");
        expect(student).not.toHaveProperty("specialization");
        expect(student).not.toHaveProperty("salary");

        expect(employee.name).toEqual("John");
        expect(employee.salary).toEqual(1000);
        expect(employee).not.toHaveProperty("department");
        expect(employee).not.toHaveProperty("specialization");
        expect(employee).not.toHaveProperty("faculty");
    })));

    test("should be able to find correct child entities when base class is used as entity metadata", () => Promise.all(connections.map(async connection => {

        const student = new Student();
        student.name = "Alice";
        student.faculty = "Economics";
        await connection.manager.save(student);

        const employee = new Employee();
        employee.name = "John";
        employee.salary = 1000;
        await connection.manager.save(employee);

        const loadedEmployee1 = await connection.manager.findOne(Employee, 1);
        expect(loadedEmployee1).toBeUndefined();

        const loadedEmployee2 = await connection.manager.findOne(Employee, 2);
        expect(loadedEmployee2!).toBeInstanceOf(Employee);
        expect(loadedEmployee2).not.toBeUndefined();
        expect(loadedEmployee2!.id).toEqual(2);
        expect(loadedEmployee2!.name).toEqual("John");
        expect(loadedEmployee2!.salary).toEqual(1000);
        expect(loadedEmployee2!).not.toHaveProperty("department");
        expect(loadedEmployee2!).not.toHaveProperty("specialization");
        expect(loadedEmployee2!).not.toHaveProperty("faculty");

        const loadedStudent1 = await connection.manager.findOne(Student, 1);
        expect(loadedStudent1!).toBeInstanceOf(Student);
        expect(loadedStudent1!.id).toEqual(1);
        expect(loadedStudent1!.name).toEqual("Alice");
        expect(loadedStudent1!.faculty).toEqual("Economics");
        expect(loadedStudent1!).not.toHaveProperty("department");
        expect(loadedStudent1!).not.toHaveProperty("specialization");
        expect(loadedStudent1!).not.toHaveProperty("salary");

        const loadedStudent2 = await connection.manager.findOne(Student, 2);
        expect(loadedStudent2).toBeUndefined();

        const loadedPerson1 = await connection.manager.findOne(Person, 1);
        expect(loadedPerson1!).toBeInstanceOf(Student);
        expect(loadedPerson1!.id).toEqual(1);
        expect(loadedPerson1!.name).toEqual("Alice");
        expect((loadedPerson1! as Student).faculty).toEqual("Economics");
        expect(loadedPerson1!).not.toHaveProperty("department");
        expect(loadedPerson1!).not.toHaveProperty("specialization");
        expect(loadedPerson1!).not.toHaveProperty("salary");

        const loadedPerson2 = await connection.manager.findOne(Person, 2);
        expect(loadedPerson2!).toBeInstanceOf(Employee);
        expect(loadedPerson2!.id).toEqual(2);
        expect(loadedPerson2!.name).toEqual("John");
        expect((loadedPerson2! as Employee).salary).toEqual(1000);
        expect(loadedPerson2!).not.toHaveProperty("department");
        expect(loadedPerson2!).not.toHaveProperty("specialization");
        expect(loadedPerson2!).not.toHaveProperty("faculty");
    })));

});
