import {Column, Entity, PrimaryGeneratedColumn} from "../../../src/index.ts";

@Entity("sample4_post_category")
export class PostCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

}
