import {Entity} from "../../../../../src/index.ts";
import {Column} from "../../../../../src/index.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/index.ts";
import {ManyToOne} from "../../../../../src/index.ts";
import {JoinColumn} from "../../../../../src/index.ts";
import {Album} from "./Album.ts";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @Column({ type: String })
    albumId: number;

    @ManyToOne(() => Album)
    @JoinColumn({ name: "albumId" })
    album: Album;

}
