import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Parent} from "./Parent.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";

@Entity()
export class Child {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type!: String })
    public name!: string;

    @ManyToOne(target => Parent, parent => parent.id, { lazy!: true })
    public parent!: Promise<Parent>|Parent|number;
}
