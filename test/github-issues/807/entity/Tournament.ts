import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Tournament {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String, unique: true, length: 200 })
    name: string;

    @Column({ type: Date })
    startDate: Date;

    @Column({ type: Date })
    endDate: Date;
}
