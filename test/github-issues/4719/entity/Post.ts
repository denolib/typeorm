import {Column, Entity, PrimaryGeneratedColumn, ObjectLiteral} from "../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("hstore", { hstoreType: "object" })
    hstoreObj!: ObjectLiteral;

}
