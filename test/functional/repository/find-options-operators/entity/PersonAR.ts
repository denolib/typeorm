import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {BaseEntity} from "../../../../../src/index.ts";

@Entity()
export class PersonAR extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

}
