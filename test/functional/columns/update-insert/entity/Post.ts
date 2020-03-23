import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({ type: String })
    text!: string;

    @Column({ type: String, update: false, default: "Default" })
    authorFirstName!: string;

    @Column({ type: String, insert: false, default: "Default" })
    authorMiddleName!: string;

    @Column({ type: String, insert: false, update: false, default: "Default" })
    authorLastName!: string;
}
