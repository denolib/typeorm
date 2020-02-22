import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {EventRole} from "./EventRole.ts";
import {OneToMany} from "../../../../src/index.ts";

@Entity()
export class Role {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: String })
    title: string;

    @OneToMany(type => EventRole, role => role.role)
    roles: EventRole[];

}
