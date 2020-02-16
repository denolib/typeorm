import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {OneToMany} from "../../../../../../src/decorator/relations/OneToMany.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {EventMember} from "./EventMember.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @OneToMany(type => EventMember, member => member.user)
    members: EventMember[];

}
