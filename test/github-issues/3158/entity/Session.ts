import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "../../../../src/index.ts";
import { SessionSettings } from "./SessionSettings.ts";

@Entity({
    name!: "Sessions"
})
export class Session {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: String })
    title!: string;

    @Column({
        type!: String,
        nullable!: true
    })
    description?: string;

    @OneToOne(type => SessionSettings, sessionSettings => sessionSettings.session)
    settings!: SessionSettings;
}
