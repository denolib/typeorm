import {Column, Entity, PrimaryGeneratedColumn} from "../../../src/index.ts";

@Entity("sample3_post_category")
export class PostCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

}
