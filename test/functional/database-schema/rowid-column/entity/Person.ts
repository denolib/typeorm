import {Generated} from "../../../../../src/index.ts";
import {PrimaryColumn} from "../../../../../src/index.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/index.ts";
import {Entity} from "../../../../../src/index.ts";
import {Column} from "../../../../../src/index.ts";

@Entity()
export class Person {

    @PrimaryGeneratedColumn("rowid")
    id!: string;

    @PrimaryColumn()
    @Generated("rowid")
    id2!: string;

    @PrimaryColumn({ generated: "rowid" })
    id3!: string;

    @Column({ generated: "rowid" })
    id4!: string;

}
