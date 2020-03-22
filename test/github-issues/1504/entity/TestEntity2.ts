import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {TestEntity1} from "./TestEntity1.ts";
import {TestEntity3} from "./TestEntity3.ts";

@Entity()
export class TestEntity2 {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToOne(t => TestEntity1, a => a.Entity2)
    Entity1!: TestEntity1;

    @OneToOne(t => TestEntity3, a => a.Entity2)
    @JoinColumn()
    Entity3!: TestEntity3;

}
