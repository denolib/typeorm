import "reflect-metadata";
import {Connection} from "../../../../../../src";
import {Student} from "./entity/Student";
import {Teacher} from "./entity/Teacher";
import {Accountant} from "./entity/Accountant";
import {Employee} from "./entity/Employee";
import {Person} from "./entity/Person";
import {Faculty} from "./entity/Faculty";
import {Specialization} from "./entity/Specialization";
import {Department} from "./entity/Department";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../utils/test-utils";

describe("table-inheritance > single-table > relations > many-to-many", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    describe("owner side", () => {

        test("should work correctly with ManyToMany relations", () => Promise.all(connections.map(async connection => {

            // -------------------------------------------------------------------------
            // Create
            // -------------------------------------------------------------------------

            const faculty1 = new Faculty();
            faculty1.name = "Economics";
            await connection.getRepository(Faculty).save(faculty1);

            const faculty2 = new Faculty();
            faculty2.name = "Programming";
            await connection.getRepository(Faculty).save(faculty2);

            const student = new Student();
            student.name = "Alice";
            student.faculties = [faculty1, faculty2];
            await connection.getRepository(Student).save(student);

            const specialization1 = new Specialization();
            specialization1.name = "Geography";
            await connection.getRepository(Specialization).save(specialization1);

            const specialization2 = new Specialization();
            specialization2.name = "Economist";
            await connection.getRepository(Specialization).save(specialization2);

            const teacher = new Teacher();
            teacher.name = "Mr. Garrison";
            teacher.specializations = [specialization1, specialization2];
            teacher.salary = 2000;
            await connection.getRepository(Teacher).save(teacher);

            const department1 = new Department();
            department1.name = "Bookkeeping";
            await connection.getRepository(Department).save(department1);

            const department2 = new Department();
            department2.name = "HR";
            await connection.getRepository(Department).save(department2);

            const accountant = new Accountant();
            accountant.name = "Mr. Burns";
            accountant.departments = [department1, department2];
            accountant.salary = 3000;
            await connection.getRepository(Accountant).save(accountant);

            // -------------------------------------------------------------------------
            // Select
            // -------------------------------------------------------------------------

            let loadedStudent = await connection.manager
                .createQueryBuilder(Student, "student")
                .leftJoinAndSelect("student.faculties", "faculty")
                .where("student.name = :name", { name: "Alice" })
                .getOne();

            expect(loadedStudent!).toHaveProperty("id");
            expect(loadedStudent!).toHaveProperty("name");
            expect(loadedStudent!).toHaveProperty("faculties");
            expect(loadedStudent!.id).toEqual(1);
            expect(loadedStudent!.name).toEqual("Alice");
            expect(loadedStudent!.faculties.length).toEqual(2);
            expect(loadedStudent!.faculties.map(f => f.name)).toContain("Economics");
            expect(loadedStudent!.faculties.map(f => f.name)).toContain("Programming");

            let loadedTeacher = await connection.manager
                .createQueryBuilder(Teacher, "teacher")
                .leftJoinAndSelect("teacher.specializations", "specialization")
                .where("teacher.name = :name", { name: "Mr. Garrison" })
                .getOne();

            expect(loadedTeacher!).toHaveProperty("id");
            expect(loadedTeacher!).toHaveProperty("name");
            expect(loadedTeacher!).toHaveProperty("specializations");
            expect(loadedTeacher!).toHaveProperty("salary");
            expect(loadedTeacher!.id).toEqual(2);
            expect(loadedTeacher!.name).toEqual("Mr. Garrison");
            expect(loadedTeacher!.specializations.length).toEqual(2);
            expect(loadedTeacher!.specializations.map(f => f.name)).toContain("Geography");
            expect(loadedTeacher!.specializations.map(f => f.name)).toContain("Economist");
            expect(loadedTeacher!.salary).toEqual(2000);

            let loadedAccountant = await connection.manager
                .createQueryBuilder(Accountant, "accountant")
                .leftJoinAndSelect("accountant.departments", "department")
                .where("accountant.name = :name", { name: "Mr. Burns" })
                .getOne();

            expect(loadedAccountant!).toHaveProperty("id");
            expect(loadedAccountant!).toHaveProperty("name");
            expect(loadedAccountant!).toHaveProperty("departments");
            expect(loadedAccountant!).toHaveProperty("salary");
            expect(loadedAccountant!.id).toEqual(3);
            expect(loadedAccountant!.name).toEqual("Mr. Burns");
            expect(loadedAccountant!.departments.length).toEqual(2);
            expect(loadedAccountant!.departments.map(f => f.name)).toContain("Bookkeeping");
            expect(loadedAccountant!.departments.map(f => f.name)).toContain("HR");
            expect(loadedAccountant!.salary).toEqual(3000);

            const loadedEmployees = await connection.manager
                .createQueryBuilder(Employee, "employee")
                .leftJoinAndSelect("employee.specializations", "specialization")
                .leftJoinAndSelect("employee.departments", "department")
                .orderBy("employee.id, specialization.id, department.id")
                .getMany();

            expect(loadedEmployees[0]).toHaveProperty("id");
            expect(loadedEmployees[0]).toHaveProperty("name");
            expect(loadedEmployees[0]).toHaveProperty("salary");
            expect(loadedEmployees[0]).toHaveProperty("specializations");
            expect(loadedEmployees[0]).toBeInstanceOf(Teacher);
            expect(loadedEmployees[0].id).toEqual(2);
            expect(loadedEmployees[0].name).toEqual("Mr. Garrison");
            expect((loadedEmployees[0] as Teacher).specializations.length).toEqual(2);
            expect((loadedEmployees[0] as Teacher)!.specializations.map(f => f.name)).toContain("Geography");
            expect((loadedEmployees[0] as Teacher)!.specializations.map(f => f.name)).toContain("Economist");
            expect(loadedEmployees[0].salary).toEqual(2000);
            expect(loadedEmployees[1]).toHaveProperty("id");
            expect(loadedEmployees[1]).toHaveProperty("name");
            expect(loadedEmployees[1]).toHaveProperty("salary");
            expect(loadedEmployees[1]).toHaveProperty("departments");
            expect(loadedEmployees[1]).toBeInstanceOf(Accountant);
            expect(loadedEmployees[1].id).toEqual(3);
            expect(loadedEmployees[1].name).toEqual("Mr. Burns");
            expect((loadedEmployees[1] as Accountant).departments.length).toEqual(2);
            expect((loadedEmployees[1] as Accountant)!.departments.map(f => f.name)).toContain("Bookkeeping");
            expect((loadedEmployees[1] as Accountant)!.departments.map(f => f.name)).toContain("HR");
            expect(loadedEmployees[1].salary).toEqual(3000);

            const loadedPersons = await connection.manager
                .createQueryBuilder(Person, "person")
                .leftJoinAndSelect("person.faculties", "faculty")
                .leftJoinAndSelect("person.specializations", "specialization")
                .leftJoinAndSelect("person.departments", "department")
                .orderBy("person.id, specialization.id, department.id")
                .getMany();

            expect(loadedPersons[0]).toHaveProperty("id");
            expect(loadedPersons[0]).toHaveProperty("name");
            expect(loadedPersons[0]).toHaveProperty("faculties");
            expect(loadedPersons[0]).toBeInstanceOf(Student);
            expect(loadedPersons[0].id).toEqual(1);
            expect(loadedPersons[0].name).toEqual("Alice");
            expect((loadedPersons[0] as Student).faculties.length).toEqual(2);
            expect((loadedPersons[0] as Student)!.faculties.map(f => f.name)).toContain("Economics");
            expect((loadedPersons[0] as Student)!.faculties.map(f => f.name)).toContain("Programming");
            expect(loadedPersons[1]).toHaveProperty("id");
            expect(loadedPersons[1]).toHaveProperty("name");
            expect(loadedPersons[1]).toHaveProperty("salary");
            expect(loadedPersons[1]).toHaveProperty("specializations");
            expect(loadedPersons[1]).toBeInstanceOf(Teacher);
            expect(loadedPersons[1].id).toEqual(2);
            expect(loadedPersons[1].name).toEqual("Mr. Garrison");
            expect((loadedPersons[1] as Teacher).specializations.length).toEqual(2);
            expect((loadedPersons[1] as Teacher)!.specializations.map(f => f.name)).toContain("Geography");
            expect((loadedPersons[1] as Teacher)!.specializations.map(f => f.name)).toContain("Economist");
            expect((loadedPersons[1] as Teacher).salary).toEqual(2000);
            expect(loadedPersons[2]).toHaveProperty("id");
            expect(loadedPersons[2]).toHaveProperty("name");
            expect(loadedPersons[2]).toHaveProperty("salary");
            expect(loadedPersons[2]).toHaveProperty("departments");
            expect(loadedPersons[2]).toBeInstanceOf(Accountant);
            expect(loadedPersons[2].id).toEqual(3);
            expect(loadedPersons[2].name).toEqual("Mr. Burns");
            expect((loadedPersons[2] as Accountant).departments.length).toEqual(2);
            expect((loadedPersons[2] as Accountant)!.departments.map(f => f.name)).toContain("Bookkeeping");
            expect((loadedPersons[2] as Accountant)!.departments.map(f => f.name)).toContain("HR");
            expect((loadedPersons[2] as Accountant).salary).toEqual(3000);

        })));

    });

    describe("inverse side", () => {

        test("should work correctly with ManyToMany relations", () => Promise.all(connections.map(async connection => {

            // -------------------------------------------------------------------------
            // Create
            // -------------------------------------------------------------------------

            const student1 = new Student();
            student1.name = "Alice";
            await connection.getRepository(Student).save(student1);

            const student2 = new Student();
            student2.name = "Bob";
            await connection.getRepository(Student).save(student2);

            const faculty = new Faculty();
            faculty.name = "Economics";
            faculty.students = [student1, student2];
            await connection.getRepository(Faculty).save(faculty);

            const teacher1 = new Teacher();
            teacher1.name = "Mr. Garrison";
            teacher1.salary = 2000;
            await connection.getRepository(Teacher).save(teacher1);

            const teacher2 = new Teacher();
            teacher2.name = "Mr. Adler";
            teacher2.salary = 1000;
            await connection.getRepository(Teacher).save(teacher2);

            const specialization = new Specialization();
            specialization.name = "Geography";
            specialization.teachers = [teacher1, teacher2];
            await connection.getRepository(Specialization).save(specialization);

            const accountant1 = new Accountant();
            accountant1.name = "Mr. Burns";
            accountant1.salary = 3000;
            await connection.getRepository(Accountant).save(accountant1);

            const accountant2 = new Accountant();
            accountant2.name = "Mr. Trump";
            accountant2.salary = 4000;
            await connection.getRepository(Accountant).save(accountant2);

            const department = new Department();
            department.name = "Bookkeeping";
            department.accountants = [accountant1, accountant2];
            await connection.getRepository(Department).save(department);

        })));

    });

});
