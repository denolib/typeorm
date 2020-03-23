import {Column} from "../../../../src/decorator/columns/Column.ts";

export class FooChildMetadata {

    @Column({ nullable: true, type: Number })
    something!: number;

    @Column({ nullable: true, type: Number })
    somethingElse!: number;

}
