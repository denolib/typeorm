import { Entity, OneToOne, JoinColumn, PrimaryColumn } from "../../../../src/index.ts";
import { Session } from "./Session.ts";

@Entity({
    name: "SessionSettings"
})
export class SessionSettings  {

    @PrimaryColumn({ type: Number })
    sessionId: number;

    @OneToOne(type => Session, session => session.id)
    @JoinColumn({ name: "sessionId", referencedColumnName: "id"})
    session?: Session;

}
