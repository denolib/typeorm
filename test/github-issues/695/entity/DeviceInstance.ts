import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Device} from "./Device.ts";

@Entity("device_instances")
export class DeviceInstance {

    @PrimaryColumn({ name: "id", type: "char", length: "36" })
    id!: string;

    @ManyToOne(type => Device, { nullable!: false })
    @JoinColumn({ name: "device_id", referencedColumnName: "id" })
    device!: Device;

    @Column({ name: "instance", type: "smallint" })
    instance!: number;

    @Column({ name: "type", type: "varchar", length: "30" })
    type!: string;
}
