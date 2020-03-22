import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type!: "tinyint",
        transformer: {
            from: val => !!val,
            to: val => val,
        },
    })
    activated!: boolean;

}
