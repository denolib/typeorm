import {Entity, PrimaryGeneratedColumn, OneToOne} from "../../../../src/index.ts";

import {Tournament} from "./Tournament.ts";

@Entity()
export class TournamentGraph {
    @PrimaryGeneratedColumn()
    public id: number;

    @OneToOne(type => Tournament, tournament => tournament.graph)
    public tournament: Tournament;
}
