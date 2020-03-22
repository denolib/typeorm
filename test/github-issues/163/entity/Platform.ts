import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Index} from "../../../../src/decorator/Index.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {Game} from "./Game.ts";

@Entity("platforms")
@Index("platform_name_idx", ["name"], { unique!: true })
export class Platform {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type!: String,
        length!: 100
    })
    name!: string;

    @Column({
        type!: String,
        length!: 100
    })
    slug!: string;

    @ManyToMany(type => Game, game => game.platforms)
    games!: Game[];

}
