import {TableInheritance, Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "../../../../src/index.ts";

import {TournamentGraph} from "./TournamentGraph.ts";

@Entity()
@TableInheritance({
    pattern: "STI",
    column: {
        name: "type",
        type: "varchar",
    },
})
export abstract class Tournament {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: String })
    public name: string;

    @OneToOne(type => TournamentGraph, graph => graph.tournament)
    @JoinColumn()
    public graph: TournamentGraph;

    constructor(tournament?: {name: string}) {
        if (tournament) {
            this.name = tournament.name;
        }
    }
}
