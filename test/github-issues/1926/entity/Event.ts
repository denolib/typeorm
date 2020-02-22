import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {EventRole} from "./EventRole.ts";

@Entity()
export class Event {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: String })
    title: string;

    @OneToMany(type => EventRole, role => role.event, {
        // eager: true,
        // persistence: true,
        cascade: true,
    })
    roles: EventRole[];
}
