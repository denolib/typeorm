import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {User} from "./User.ts";

@Entity()
export class Photo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  description: string;

  @Column({ type: String })
  uri: string;

  @Column({ type: Number })
  userId: number;

  @ManyToOne(type => User, user => user.photos)
  user: User;

}
