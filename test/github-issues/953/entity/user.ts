import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { Column } from "../../../../src/decorator/columns/Column.ts";
import { PrimaryGeneratedColumn } from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";


export type Role = "sa" | "user" | "admin" | "server";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type!: String,
        length: 32,
        unique!: true
    })
    username!: string;

    @Column({
        type!: String,
        nullable!: true
    })
    password!: string;

    @Column({
        type!: String,
        nullable!: true
    })
    phone!: string;

    @Column("json")
    roles!: Role[];

    @Column({ type: Date })
    lastLoginAt!: Date;

}
