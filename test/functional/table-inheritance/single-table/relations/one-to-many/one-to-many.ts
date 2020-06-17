import {runIfMain} from "../../../../../deps/mocha.ts";
import "../../../../../deps/chai.ts";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../utils/test-utils.ts";
import {Connection} from "../../../../../../src/connection/Connection.ts";
import {Student} from "./entity/Student.ts";
import {Teacher} from "./entity/Teacher.ts";
import {Accountant} from "./entity/Accountant.ts";
import {Employee} from "./entity/Employee.ts";
import {Person} from "./entity/Person.ts";
import {Faculty} from "./entity/Faculty.ts";
import {Specialization} from "./entity/Specialization.ts";
import {Department} from "./entity/Department.ts";

describe("table-inheritance > single-table > relations > one-to-many", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Accountant, Department, Employee, Faculty, Person, Specialization, Student, Teacher]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work correctly with OneToMany relations", () => Promise.all(connections.map(async connection => {

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
            .orderBy("student.id, faculty.id")
            .getOne();

        loadedStudent!.should.have.all.keys("id", "name", "faculties");
        loadedStudent!.id.should.equal(1);
        loadedStudent!.name.should.equal("Alice");
        loadedStudent!.faculties.length.should.equal(2);
        loadedStudent!.faculties[0].name.should.be.equal("Economics");
        loadedStudent!.faculties[1].name.should.be.equal("Programming");

        let loadedTeacher = await connection.manager
            .createQueryBuilder(Teacher, "teacher")
                .leftJoinAndSelect("teacher.specializations", "specialization")
                .where("teacher.name = :name", { name: "Mr. Garrison" })
                .orderBy("teacher.id, specialization.id")
                .getOne();

        loadedTeacher!.should.have.all.keys("id", "name", "specializations", "salary");
        loadedTeacher!.id.should.equal(2);
        loadedTeacher!.name.should.equal("Mr. Garrison");
        loadedTeacher!.specializations.length.should.equal(2);
        loadedTeacher!.specializations[0].name.should.be.equal("Geography");
        loadedTeacher!.specializations[1].name.should.be.equal("Economist");
        loadedTeacher!.salary.should.equal(2000);

        let loadedAccountant = await connection.manager
            .createQueryBuilder(Accountant, "accountant")
            .leftJoinAndSelect("accountant.departments", "department")
            .where("accountant.name = :name", { name: "Mr. Burns" })
            .orderBy("accountant.id, department.id")
            .getOne();

        loadedAccountant!.should.have.all.keys("id", "name", "departments", "salary");
        loadedAccountant!.id.should.equal(3);
        loadedAccountant!.name.should.equal("Mr. Burns");
        loadedAccountant!.departments.length.should.equal(2);
        loadedAccountant!.departments[0].name.should.be.equal("Bookkeeping");
        loadedAccountant!.departments[1].name.should.be.equal("HR");
        loadedAccountant!.salary.should.equal(3000);

        const loadedEmployees = await connection.manager
            .createQueryBuilder(Employee, "employee")
            .leftJoinAndSelect("employee.specializations", "specialization")
            .leftJoinAndSelect("employee.departments", "department")
            .orderBy("employee.id, specialization.id, department.id")
            .getMany();

        loadedEmployees[0].should.have.all.keys("id", "name", "salary", "specializations");
        loadedEmployees[0].should.be.instanceof(Teacher);
        loadedEmployees[0].id.should.equal(2);
        loadedEmployees[0].name.should.equal("Mr. Garrison");
        (loadedEmployees[0] as Teacher).specializations.length.should.equal(2);
        (loadedEmployees[0] as Teacher).specializations[0].name.should.be.equal("Geography");
        (loadedEmployees[0] as Teacher).specializations[1].name.should.be.equal("Economist");
        loadedEmployees[0].salary.should.equal(2000);
        loadedEmployees[1].should.have.all.keys("id", "name", "salary", "departments");
        loadedEmployees[1].should.be.instanceof(Accountant);
        loadedEmployees[1].id.should.equal(3);
        loadedEmployees[1].name.should.equal("Mr. Burns");
        (loadedEmployees[1] as Accountant).departments.length.should.equal(2);
        (loadedEmployees[1] as Accountant).departments[0].name.should.be.equal("Bookkeeping");
        (loadedEmployees[1] as Accountant).departments[1].name.should.be.equal("HR");
        loadedEmployees[1].salary.should.equal(3000);

        const loadedPersons = await connection.manager
            .createQueryBuilder(Person, "person")
            .leftJoinAndSelect("person.faculties", "faculty")
            .leftJoinAndSelect("person.specializations", "specialization")
            .leftJoinAndSelect("person.departments", "department")
            .orderBy("person.id, specialization.id, department.id, faculty.id")
            .getMany();

        loadedPersons[0].should.have.all.keys("id", "name", "faculties");
        loadedPersons[0].should.be.instanceof(Student);
        loadedPersons[0].id.should.equal(1);
        loadedPersons[0].name.should.equal("Alice");
        (loadedPersons[0] as Student).faculties.length.should.equal(2);
        (loadedPersons[0] as Student).faculties[0].name.should.be.equal("Economics");
        (loadedPersons[0] as Student).faculties[1].name.should.be.equal("Programming");
        loadedPersons[1].should.have.all.keys("id", "name", "salary", "specializations");
        loadedPersons[1].should.be.instanceof(Teacher);
        loadedPersons[1].id.should.equal(2);
        loadedPersons[1].name.should.equal("Mr. Garrison");
        (loadedPersons[1] as Teacher).specializations.length.should.equal(2);
        (loadedPersons[1] as Teacher).specializations[0].name.should.be.equal("Geography");
        (loadedPersons[1] as Teacher).specializations[1].name.should.be.equal("Economist");
        (loadedPersons[1] as Teacher).salary.should.equal(2000);
        loadedPersons[2].should.have.all.keys("id", "name", "salary", "departments");
        loadedPersons[2].should.be.instanceof(Accountant);
        loadedPersons[2].id.should.equal(3);
        loadedPersons[2].name.should.equal("Mr. Burns");
        (loadedPersons[2] as Accountant).departments.length.should.equal(2);
        (loadedPersons[2] as Accountant).departments[0].name.should.be.equal("Bookkeeping");
        (loadedPersons[2] as Accountant).departments[1].name.should.be.equal("HR");
        (loadedPersons[2] as Accountant).salary.should.equal(3000);

    })));

});

runIfMain(import.meta);
