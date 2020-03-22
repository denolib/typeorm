import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";
import {Student} from "./Student.ts";

@Entity()
export class Faculty {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToOne(type => Student, student => student.faculties)
    student!: Student;

}
