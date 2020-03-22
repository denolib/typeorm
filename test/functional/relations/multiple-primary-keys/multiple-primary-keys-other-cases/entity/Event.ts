import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {OneToMany} from "../../../../../../src/decorator/relations/OneToMany.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {EventMember} from "./EventMember.ts";
import {Person} from "./Person.ts";

@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToOne(type => Person)
    author!: Person;

    @OneToMany(type => EventMember, member => member.event)
    members!: EventMember[];

}
