import { Column, Entity, PrimaryGeneratedColumn } from "../../../../src/index.ts";

@Entity({schema: "schema"})
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("enum", { enum: ["A", "B", "C"] })
    enum!: string;

    @Column({ type: String })
    name!: string;
}
