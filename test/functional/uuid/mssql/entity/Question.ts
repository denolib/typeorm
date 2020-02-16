import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Generated} from "../../../../../src/decorator/Generated.ts";

@Entity()
export class Question {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: String })
    @Generated("uuid")
    uuid: string;

    @Column("uniqueidentifier", { nullable: true })
    uuid2: string|null;

    @Column("uniqueidentifier", { nullable: true })
    @Generated("uuid")
    uuid3: string|null;

}
