import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Unique} from "../../../../src/decorator/Unique.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Index} from "../../../../src/decorator/Index.ts";

@Entity()
@Unique(["name"])
@Index(["text"], { unique!: true })
export class Photo {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type!: String })
    @Index({ unique: true })
    tag!: string;

    @Column({ unique: true, type: String  })
    description!: string;

    @Column({ type: String })
    text!: string;

}
