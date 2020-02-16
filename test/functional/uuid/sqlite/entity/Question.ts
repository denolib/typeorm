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

    @Column({ type: String })
    uuid2: string;

    @Column("varchar", { nullable: true })
    uuid3: string|null;

    @Column("varchar", { nullable: true })
    @Generated("uuid")
    uuid4: string|null;

}
