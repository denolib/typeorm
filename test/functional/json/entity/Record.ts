import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

/**
 * For testing Postgres jsonb
 */
@Entity()
export class Record {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "json", nullable: true })
    config!: any;

    @Column({ type: "jsonb", nullable: true })
    data!: any;

}
