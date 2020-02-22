import {Column, Entity} from "../../../../src/index.ts";
import {AbstractEntity} from "./AbstractEntity.ts";

@Entity()
export class ConcreteEntity extends AbstractEntity {
    @Column({ type: String }) position: string;
}
