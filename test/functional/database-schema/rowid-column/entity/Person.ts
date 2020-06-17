import {Generated} from "../../../../../src/index.ts";
import {PrimaryColumn} from "../../../../../src/index.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/index.ts";
import {Entity} from "../../../../../src/index.ts";
import {Column} from "../../../../../src/index.ts";

@Entity()
export class Person {

    @PrimaryGeneratedColumn("rowid")
    id!: string;

    @PrimaryColumn({ type: String })
    @Generated("rowid")
    id2!: string;

    @PrimaryColumn({ type: String, generated: "rowid" })
    id3!: string;

    @Column({ type: String, generated: "rowid" })
    id4!: string;

}
