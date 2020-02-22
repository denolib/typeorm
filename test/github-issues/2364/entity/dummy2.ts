import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column, PrimaryColumn} from "../../../../src/index.ts";

@Entity()
export class Dummy2 {
    @PrimaryColumn("integer", {
        generated: true,
        nullable: false,
        primary: true,
    })
    id: number;

    @Column({ type: String, default: "name" })
    name: string;
}

