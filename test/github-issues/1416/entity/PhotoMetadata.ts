import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from "../../../../src/index.ts";
import {Photo} from "./Photo.ts";

@Entity()
export class PhotoMetadata {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  height: number;

  @Column("int")
  width: number;

  @Column({ type: String })
  orientation: string;

  @Column({ type: Boolean })
  compressed: boolean;

  @Column({ type: String })
  comment: string;

  @OneToOne(type => Photo, photo => photo.metadata)
  photo: Photo;
}
