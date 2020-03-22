import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {BaseEntity} from "../../../../src/repository/BaseEntity.ts";

@Entity()
export class Foo extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

}
