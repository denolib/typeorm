import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Index} from "../../../../src/decorator/Index.ts";

@Entity()
@Index("unique_idx", ["first_name", "last_name"], { unique: true })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100 })
    first_name: string;

    @Column({ type: "varchar", length: 100 })
    last_name: string;

    @Column({ type: "varchar", length: 100 })
    is_updated: string;
 }
