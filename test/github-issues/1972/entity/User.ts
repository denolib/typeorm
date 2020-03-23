import { Entity, PrimaryGeneratedColumn, Column } from "../../../../src/index.ts";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type!: String })
    public name!: string;

    constructor(user?: { name: string }) {
        if (user) {
            this.name = user.name;
        }
    }
}
