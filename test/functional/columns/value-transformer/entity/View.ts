import { Entity, PrimaryGeneratedColumn, Column } from "../../../../../src/index.ts";

@Entity()
export class View {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: String, transformer: []})
    title!: string;
}
