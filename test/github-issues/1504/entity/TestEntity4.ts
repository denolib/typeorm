import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {TestEntity3} from "./TestEntity3.ts";

@Entity()
export class TestEntity4 {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToOne(t => TestEntity3, entity3 => entity3.Entity4)
    Entity3!: TestEntity3;
}
