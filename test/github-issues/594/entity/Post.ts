import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    postId!: number;

    @Column({ type: Number })
    modelId!: number;

}
