import {Column, Entity, PrimaryColumn} from "../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number, unsigned: true })
    id: number;

    @Column({ type: Number, zerofill: true })
    num: number;

}
