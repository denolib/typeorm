import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity("Tags")
export class Tag {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    a!: string;

    @Column({ type: String })
    b!: string;

    @Column({ type: String })
    c!: string;
}
