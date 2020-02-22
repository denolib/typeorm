import {Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Index} from "../../../../src/decorator/Index.ts";

@Entity()
@Index(["name"], { fulltext: true })
@Index(["point"], { spatial: true })
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @Column("point")
    point: string;

    @Column("polygon")
    polygon: string;

}
