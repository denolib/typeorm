import {Column, Entity, PrimaryGeneratedColumn, TableInheritance} from "../../../../../../src/index.ts";

@Entity({database: "test"})
@TableInheritance({column: {name: "type", type: "varchar"}})
export class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

}
