import {Column} from "../../../../src/decorator/columns/Column.ts";

export class Duration {

    @Column({ type: Number, name: "duration_minutes" })
    durationMinutes!: number;

    @Column({ type: Number, name: "duration_hours" })
    durationHours!: number;

    @Column({ type: Number, name: "duration_days" })
    durationDays!: number;

}
