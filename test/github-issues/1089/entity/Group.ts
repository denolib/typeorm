import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent} from "../../../../src/index.ts";

@Entity()
@Tree("closure-table")
export class Group extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: String, nullable: false })
    name: string;

    @TreeChildren()
    children: Group;

    @TreeParent()
    parent: Group;
}
