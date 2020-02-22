import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "../../../../src/index.ts";
import {User} from "./User.ts";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    url: string;

    @ManyToOne("User", "photos")
    user: User;

}
