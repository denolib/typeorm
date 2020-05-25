import {Entity, PrimaryGeneratedColumn, TableInheritance} from "../../../../src/index.ts";

export abstract class Engine {}

@Entity()
@TableInheritance({ column: { name: "type", type: "varchar" }})
export abstract class Vehicle {

    @PrimaryGeneratedColumn()
    public id?: number;

    public abstract engine: Engine;

}
