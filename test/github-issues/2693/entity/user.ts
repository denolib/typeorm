import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";

@Entity({name: "users", synchronize: false})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: number;
}
