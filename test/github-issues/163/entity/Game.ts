import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Index} from "../../../../src/decorator/Index.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";
import {Platform} from "./Platform.ts";

@Entity("games")
@Index("game_name_idx", ["name"], { unique: true })
export class Game {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: String,
        length: 80
    })
    name: string;

    @Column({
        type: String,
        name: "search_terms",
        length: 80
    })
    searchTerms: string;

    @Column({
        type: Boolean,
        name: "reviewed"
    })
    isReviewed: boolean;

    @ManyToMany(type => Platform, platform => platform.games, {
        cascade: true
    })
    @JoinTable()
    platforms: Platform[];

}
