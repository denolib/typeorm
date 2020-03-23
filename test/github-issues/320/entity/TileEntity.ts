import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";
import {ActivityEntity} from "./ActivityEntity.ts";

@Entity("tile")
export class TileEntity {
    @PrimaryGeneratedColumn({type: "bigint"})
    id!: string;

    @ManyToMany(type => TileEntity, tile => tile.children, {
        cascade!: ["insert"]
    })
    @JoinTable()
    parents!: TileEntity[];

    @ManyToMany(type => TileEntity, tile => tile.parents, {
        cascade!: ["insert"]
    })
    children!: TileEntity[];

    @ManyToMany(type => ActivityEntity, activity => activity.tiles, {
        cascade!: ["insert"]
    })
    @JoinTable()
    activities!: ActivityEntity[];
}
