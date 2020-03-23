import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";

@Entity()
export class PostDefaultValues {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({ default: "hello post", type: String })
    text!: string;

    @Column({ default: true, type: Boolean })
    isActive!: boolean;

    @Column({ default: () => "CURRENT_TIMESTAMP", type: Date })
    addDate!: Date;

    @Column({ default: 0, type: Number })
    views!: number;

    @Column({ nullable: true, type: String })
    description!: string;

}
