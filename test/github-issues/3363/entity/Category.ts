import { PrimaryGeneratedColumn } from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import { Column } from "../../../../src/decorator/columns/Column.ts";
import { Entity } from "../../../../src/decorator/entity/Entity.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

}
