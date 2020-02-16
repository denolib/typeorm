import {Column, Entity, PrimaryGeneratedColumn} from "../../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: String })
    title: string;

    @Column({ type: Number })
    likes: number;

}
