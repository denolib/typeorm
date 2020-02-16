import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";
import {Accountant} from "./Accountant.ts";

@Entity()
export class Department {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @ManyToOne(type => Accountant, accountant => accountant.departments)
    accountant: Accountant;

}
