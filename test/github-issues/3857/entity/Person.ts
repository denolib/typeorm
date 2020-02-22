import {Entity, PrimaryGeneratedColumn, Column, TableInheritance} from "../../../../src/index.ts";

@Entity({schema: "custom"})
@TableInheritance({column: {type: "varchar", name: "type"}})
export abstract class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    name: string;
}
