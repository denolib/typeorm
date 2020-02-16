import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Faculty} from "./Faculty.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {Teacher} from "./Teacher.ts";
import {Index} from "../../../../src/decorator/Index.ts";

@Entity()
@Index("student_name_index", ["name"])
export class Student {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @ManyToOne(type => Faculty)
    faculty: Faculty;

    @ManyToOne(type => Teacher)
    teacher: Teacher;

}
