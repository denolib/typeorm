import {Entity} from "../../../../src/index.ts";
import {PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Column, VersionColumn} from "../../../../src/index.ts";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @VersionColumn({ type: Number })
    version: number;

    @Column({ type: "jsonb" })
    problems: object;
}
