import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, type: String })
    name: string;
}
