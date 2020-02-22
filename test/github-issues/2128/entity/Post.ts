import { PrimaryGeneratedColumn, Entity, Column } from "../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @Column({
        type: "json"
    })
    meta: any;

}
