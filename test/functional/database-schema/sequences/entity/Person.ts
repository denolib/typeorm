import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Person {

    @PrimaryGeneratedColumn()
    Id!: number;

    @Column({
        type!: String,
        unique!: true
    })
    Name!: string;

}
