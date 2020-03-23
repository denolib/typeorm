import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Child} from "./Child.ts";
import {OneToMany} from "../../../../src/decorator/relations/OneToMany.ts";

@Entity()
export class Parent {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type!: String })
    public name!: string;

    @OneToMany(target => Child, child => child.parent, { lazy!: true })
    public children!: Promise<Child[]>;
}
