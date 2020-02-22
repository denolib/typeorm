import {Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {TestEntity2} from "./TestEntity2.ts";
import {TestEntity4} from "./TestEntity4.ts";

@Entity()
export class TestEntity3 {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(t => TestEntity2, a => a.Entity3)
    Entity2: TestEntity2;

    @Column({ type: String })
    name: string;

    @OneToMany(t => TestEntity4, entity4 => entity4.Entity3)
    Entity4: TestEntity4[];
}
