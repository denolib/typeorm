import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { PrimaryGeneratedColumn } from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
}
