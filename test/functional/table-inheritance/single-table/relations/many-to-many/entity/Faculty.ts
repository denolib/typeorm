import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {Student} from "./Student.ts";

@Entity()
export class Faculty {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToMany(type => Student, student => student.faculties)
    students!: Student[];

}
