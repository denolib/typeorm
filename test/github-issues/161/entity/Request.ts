import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {Ticket} from "./Ticket.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Request {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    owner!: string;

    @Column({ type: String })
    type!: string;

    @Column({ type: Boolean })
    success!: boolean;

    @OneToOne(type => Ticket, ticket => ticket.request)
    ticket!: Ticket;

}
