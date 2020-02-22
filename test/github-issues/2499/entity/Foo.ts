import {Column, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";

@Entity("foo")
export class Foo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    description: string;
}
