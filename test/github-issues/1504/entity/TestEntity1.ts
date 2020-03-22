import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {TestEntity2} from "./TestEntity2.ts";

@Entity()
export class TestEntity1 {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String }) name!: string;

    @OneToOne(t => TestEntity2, a => a.Entity1)
    @JoinColumn()
    Entity2!: TestEntity2;
}
