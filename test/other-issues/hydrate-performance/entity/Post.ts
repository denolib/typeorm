import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    constructor(title?: string) {
        if (title) this.title = title;
    }

}
