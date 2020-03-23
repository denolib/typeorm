import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {BaseEntity} from "../../../../src/repository/BaseEntity.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {Foo} from "./Foo.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";

@Entity()
export class Bar extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(type => Foo, {
        onDelete!: "SET NULL"
    })
    @JoinColumn()
    foo!: Foo;

}
