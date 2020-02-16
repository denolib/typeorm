import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";

@Entity("post_without_v_ud")
export class PostWithoutVersionAndUpdateDate {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

}
