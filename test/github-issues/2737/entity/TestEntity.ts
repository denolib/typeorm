import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { Column } from "../../../../src/decorator/columns/Column.ts";
import { PrimaryGeneratedColumn } from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
@Entity()
export class TestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100, nullable: true, unique: true })
    unique_column: string;

    @Column({ type: "varchar", length: 100, nullable: true, unique: false })
    nonunique_column: string;
}
