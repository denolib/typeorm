import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Student} from "./Student.ts";
import {OneToMany} from "../../../../src/decorator/relations/OneToMany.ts";
import {Index} from "../../../../src/decorator/Index.ts";

@Entity()
@Index("ignored_index", { synchronize!: false })
export class Teacher {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToMany(type => Student, student => student.teacher)
    students!: Student[];

}
