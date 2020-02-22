import { Entity, Column, PrimaryGeneratedColumn } from "../../../../src/index.ts";

export enum Realm {
    Blackrock = "Blackrock",
    KelThuzad = "Kel'Thuzad",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: Realm })
    realm: Realm;
}
