import {Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn} from "../../../../src/index.ts";
import {PhotoMetadata} from "./PhotoMetadata.ts";
import {Author} from "./Author.ts";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type!: String,
        length!: 500,
    })
    name!: string;

    @Column("text")
    description!: string;

    @Column({ type: String })
    filename!: string;

    @Column({ type: Boolean })
    isPublished!: boolean;

    @ManyToOne(type => Author, author => author.photos)
    author!: Author;

    @OneToOne(type => PhotoMetadata, photoMetadata => photoMetadata.photo, {eager: true})
    @JoinColumn()
    metadata!: PhotoMetadata;
}
