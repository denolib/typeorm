import { Entity, TableInheritance, PrimaryGeneratedColumn } from "../../../../src";

@Entity()
@TableInheritance({
    pattern: "STI",
    column: {
        name: "type",
        type: "varchar",
    },
})
export abstract class TournamentParticipant {
    @PrimaryGeneratedColumn()
    public id: number;
}
