import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";

@Entity()
export class Document {

    @PrimaryColumn("text")
    id!: string;

    @Column("text")
    docId!: string;

    @Column("text")
    label!: string;

    @Column("text")
    context!: string;

    @Column({type: "jsonb"})
    distributions!: Distribution[];

    @Column({type: "timestamp with time zone"})
    date!: Date;
}

export interface Distribution {
    weight: string;
    id: number;
    docId: number;
}
