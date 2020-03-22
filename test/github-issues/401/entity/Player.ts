import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {Group} from "./Group.ts";

@Entity()
export class Player {

    @PrimaryColumn({ type: String })
    email!: string;

    @ManyToOne(type => Group)
    group!: Group;

}
