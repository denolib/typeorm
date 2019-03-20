import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src";

@Entity("playlists")
export class Playlist {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "bigint" })
    user!: string;

    @Column({ type: "bigint" })
    guild!: string;

    @Column({ type: "text" })
    name!: string;

    @Column({ type: "text" })
    description!: string | null;

    @Column({ type: "text", array: true, default: () => "ARRAY[]::text[]" })
    songs!: string[];

    @Column({ default: 0 })
    plays!: number;
}
