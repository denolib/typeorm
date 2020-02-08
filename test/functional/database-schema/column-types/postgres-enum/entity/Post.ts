import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("enum", { enum: ["A", "B", "C"] })
    enum: string;

    @Column("simple-enum", { enum: ["A", "B", "C"] })
    simpleEnum: string;

    @Column({ type: String })
    name: string;
}
