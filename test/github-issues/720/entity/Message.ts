import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";

@Entity()
export class Message {

    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    id!: string;

}
