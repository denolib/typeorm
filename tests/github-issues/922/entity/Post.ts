import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("hstore", { hstoreType: "object" })
    hstoreObj: Object;

    @Column("hstore", { hstoreType: "string" })
    hstoreStr: string;

}
