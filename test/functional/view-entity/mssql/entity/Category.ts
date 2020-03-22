import {Entity} from "../../../../../src/index.ts";
import {Column} from "../../../../../src/index.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/index.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

}
