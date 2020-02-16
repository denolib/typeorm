import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";
import {Teacher} from "./Teacher.ts";

@Entity()
export class Specialization {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @ManyToOne(type => Teacher, teacher => teacher.specializations)
    teacher: Teacher;

}
