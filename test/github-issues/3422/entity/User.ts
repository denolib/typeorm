import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Tree} from "../../../../src/decorator/tree/Tree.ts";
import {TreeChildren} from "../../../../src/decorator/tree/TreeChildren.ts";
import {TreeParent} from "../../../../src/decorator/tree/TreeParent.ts";

@Entity({ name: "users", schema: "admin" })
@Tree("nested-set")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @TreeParent()
    public manager: User;

    @TreeChildren()
    public managerOf: User[];
}
