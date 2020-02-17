import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Duration} from "./Duration.ts";

@Entity()
export class Race {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @Column(type => Duration)
    duration: Duration;

}
