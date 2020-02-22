import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {Request} from "./Request.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Ticket {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @OneToOne(type => Request, {
        cascade: true
    })
    @JoinColumn()
    request: Request;

}
