import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

@Entity()
export class PostUuid {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ type: String })
    text: string;

}
