import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    firstName!: string;

    @Column({ type: String })
    lastName!: string;

    @Column({ type: String, asExpression: "concat(`firstName`,' ',`lastName`)" })
    virtualFullName!: string;

    @Column({ type: String, asExpression: "concat(`firstName`,' ',`lastName`)", generatedType: "STORED" })
    storedFullName!: string;

}
