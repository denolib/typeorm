import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {BaseEntity} from "../../../../src/repository/BaseEntity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Category  extends BaseEntity {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

}
