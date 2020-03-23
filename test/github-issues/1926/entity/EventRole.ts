import {Column, Entity, ManyToOne, PrimaryColumn} from "../../../../src/index.ts";
import {Event} from "./Event.ts";
import {Role} from "./Role.ts";

@Entity()
export class EventRole {

    @PrimaryColumn({ type: String })
    eventId!: string;

    @PrimaryColumn({ type: String })
    roleId!: string;

    @Column({ type: String })
    description!: string;

    @Column({ type: String })
    compensation!: string;

    @ManyToOne(type => Role, role => role.roles, {
        onDelete!: "CASCADE"
    })
    role!: Role;

    @ManyToOne(type => Event, event => event.roles, {
        onDelete!: "CASCADE"
    })
    event!: Event;
}
