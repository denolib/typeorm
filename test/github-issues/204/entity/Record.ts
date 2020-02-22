import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {RecordData} from "./RecordData.ts";
import {RecordConfig} from "./RecordConfig.ts";

@Entity()
export class Record {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "json" })
    configs: RecordConfig[];

    @Column({ type: "jsonb" })
    datas: RecordData[];

}
