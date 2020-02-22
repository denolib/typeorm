import {ChildEntity, JoinColumn, OneToOne} from "../../../../src/index.ts";
import {TournamentParticipant} from "./TournamentParticipant.ts";
import {User} from "./User.ts";

@ChildEntity()
export class TournamentUserParticipant extends TournamentParticipant {
    @OneToOne(type => User, {
        eager: true,
    })
    @JoinColumn()
    public user: User;

    constructor(tournamentUserParticipant?: { user: User }) {
        super();

        if (tournamentUserParticipant) {
            this.user = tournamentUserParticipant.user;
        }
    }

}
