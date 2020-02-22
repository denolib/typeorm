import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";

@Entity()
export class Dummy {
    @Column("integer", {
        generated: true,
        nullable: false,
        primary: true,
    })
    id: number;

    @Column({ type: String, default: "name" })
    name: string;
}

