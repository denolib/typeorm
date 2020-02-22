import { CreateDateColumn } from "../../../../src/index.ts";
import { PrimaryGeneratedColumn } from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import { Entity } from "../../../../src/decorator/entity/Entity.ts";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    date: Date;
}
