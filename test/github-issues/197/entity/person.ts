import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { Index } from "../../../../src/decorator/Index.ts";
import { PrimaryGeneratedColumn } from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import { Column } from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Person {

    @PrimaryGeneratedColumn()
    id!: number;

    @Index({
        unique!: true
    })
    @Column({ type: String })
    firstname!: string;

    @Column({ type: String })
    lastname!: string;
}
