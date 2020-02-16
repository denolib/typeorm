import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Student} from "./Student.ts";
import {OneToMany} from "../../../../src/decorator/relations/OneToMany.ts";

@Entity()
export class Teacher {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @OneToMany(type => Student, student => student.teacher)
    students: Student[];

}
