import {Column} from "../../../../src/decorator/columns/Column.ts";
import {FooChildMetadata} from "./FooChildMetadata.ts";

export class FooMetadata {

    @Column({ type: Number, nullable: true })
    bar!: number;

    @Column(type => FooChildMetadata)
    child?: FooChildMetadata;

}
