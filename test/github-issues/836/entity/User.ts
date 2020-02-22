import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Index} from "../../../../src/decorator/Index.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    @Index()
    email: string;

    @Column({ type: String })
    @Index()
    username: string;

    @Column({ type: Number })
    @Index()
    privilege: number;

}
