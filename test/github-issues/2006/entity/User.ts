import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("varchar", { nullable: true })
    token: string | null = null;

    @Column({
        type!: "tinyint",
        default: 0,
        width!: 1
    })
    dnd: boolean = false;

}
