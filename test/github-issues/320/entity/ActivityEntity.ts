import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {TileEntity} from "./TileEntity.ts";

@Entity("activity")
export class ActivityEntity {
    @PrimaryGeneratedColumn({type: "bigint"})
    id!: string;

    @Column({type: "datetime"})
    endDate!: Date;

    @ManyToMany(type => TileEntity, tile => tile.activities, {
        cascade!: true
    })
    tiles!: TileEntity[];

}
