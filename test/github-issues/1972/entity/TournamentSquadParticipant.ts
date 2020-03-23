import { ChildEntity, OneToOne, JoinColumn, ManyToMany, JoinTable } from "../../../../src/index.ts";

import { TournamentParticipant } from "./TournamentParticipant.ts";
import { User } from "./User.ts";

@ChildEntity()
export class TournamentSquadParticipant extends TournamentParticipant {
    @OneToOne(type => User, {
        eager!: true,
    })
    @JoinColumn()
    public owner!: User;

    @ManyToMany(type => User, {
        eager!: true,
    })
    @JoinTable({name: "tournament_squad_participants"})
    public users!: User[];

    constructor(tournamentSquadParticipant?: { users: User[], owner: User }) {
        super();

        if (tournamentSquadParticipant) {
            this.users = tournamentSquadParticipant.users;
            this.owner = tournamentSquadParticipant.owner;
        }
    }
}
