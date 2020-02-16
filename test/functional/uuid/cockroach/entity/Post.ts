import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Generated} from "../../../../../src/decorator/Generated.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: String })
    @Generated("uuid")
    uuid: string;

}
